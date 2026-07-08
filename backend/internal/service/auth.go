package service

import (
	"context"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/desakeikecil/api/internal/apperror"
	"github.com/desakeikecil/api/internal/dto"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/repository"
)

type Claims struct {
	Nama  string `json:"nama"`
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.RegisteredClaims
}

type AuthService struct {
	admins repository.AdminRepository
	secret []byte
	ttl    time.Duration
}

func NewAuth(admins repository.AdminRepository, secret string, ttl time.Duration) *AuthService {
	return &AuthService{admins: admins, secret: []byte(secret), ttl: ttl}
}

// Login memverifikasi kredensial dan menerbitkan JWT (sesi 8 jam, §7.1).
// Pesan error sengaja tidak membedakan email salah vs sandi salah.
func (s *AuthService) Login(ctx context.Context, req dto.LoginRequest) (*entity.Admin, string, error) {
	admin, err := s.admins.ByEmail(ctx, req.Email)
	if err != nil {
		return nil, "", apperror.Internal(err)
	}
	if admin == nil {
		// Tetap lakukan perbandingan bcrypt agar durasi respons seragam
		// (mencegah user enumeration lewat timing)
		_ = bcrypt.CompareHashAndPassword(
			[]byte("$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"),
			[]byte(req.Password),
		)
		return nil, "", apperror.Unauthorized("Email atau kata sandi salah.")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(req.Password)); err != nil {
		return nil, "", apperror.Unauthorized("Email atau kata sandi salah.")
	}

	token, err := s.issueToken(admin)
	if err != nil {
		return nil, "", apperror.Internal(err)
	}
	return admin, token, nil
}

func (s *AuthService) issueToken(admin *entity.Admin) (string, error) {
	now := time.Now()
	claims := Claims{
		Nama:  admin.Nama,
		Email: admin.Email,
		Role:  admin.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   fmt.Sprint(admin.ID),
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(s.ttl)),
			Issuer:    "api-keikecil",
		},
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(s.secret)
}

// Verify memvalidasi token dan mengembalikan claims-nya.
func (s *AuthService) Verify(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("metode tanda tangan tidak dikenal: %v", t.Header["alg"])
		}
		return s.secret, nil
	})
	if err != nil || !token.Valid {
		return nil, apperror.Unauthorized("")
	}
	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, apperror.Unauthorized("")
	}
	return claims, nil
}

func (s *AuthService) TTL() time.Duration { return s.ttl }
