package service

import (
	"context"
	"strings"

	"golang.org/x/crypto/bcrypt"

	"github.com/desakeikecil/api/internal/apperror"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/repository"
)

// AdminService mengelola akun admin (khusus super_admin). Menjaga agar
// selalu tersisa minimal satu super admin aktif dan mencegah operator
// mengunci dirinya sendiri.
type AdminService struct {
	repo repository.AdminRepository
}

func NewAdminService(repo repository.AdminRepository) *AdminService {
	return &AdminService{repo: repo}
}

func (s *AdminService) List(ctx context.Context) ([]entity.Admin, error) {
	items, err := s.repo.List(ctx)
	if err != nil {
		return nil, apperror.Internal(err)
	}
	return items, nil
}

func (s *AdminService) Create(ctx context.Context, nama, username, password, role string) (*entity.Admin, error) {
	username = strings.ToLower(strings.TrimSpace(username))
	exists, err := s.repo.ExistsByUsername(ctx, username, 0)
	if err != nil {
		return nil, apperror.Internal(err)
	}
	if exists {
		return nil, apperror.Duplicate(username)
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, apperror.Internal(err)
	}

	admin := &entity.Admin{
		Nama:         nama,
		Username:     username,
		PasswordHash: string(hash),
		Role:         role,
		IsActive:     true,
	}
	if err := s.repo.Create(ctx, admin); err != nil {
		return nil, apperror.Internal(err)
	}
	return admin, nil
}

func (s *AdminService) Update(ctx context.Context, id, actingID uint, nama, role string, isActive bool) (*entity.Admin, error) {
	target, err := s.repo.ByID(ctx, id)
	if err != nil {
		return nil, apperror.Internal(err)
	}
	if target == nil {
		return nil, apperror.NotFound("Akun admin")
	}

	self := id == actingID
	if self && !isActive {
		return nil, apperror.BadRequest("Anda tidak bisa menonaktifkan akun sendiri.")
	}
	if self && target.Role == entity.RoleSuperAdmin && role != entity.RoleSuperAdmin {
		return nil, apperror.BadRequest("Anda tidak bisa menurunkan peran akun sendiri.")
	}

	// Jaga agar selalu ada minimal satu super admin aktif.
	losingSuper := target.Role == entity.RoleSuperAdmin && target.IsActive &&
		(role != entity.RoleSuperAdmin || !isActive)
	if losingSuper {
		others, err := s.repo.CountActiveSuperAdmins(ctx, id)
		if err != nil {
			return nil, apperror.Internal(err)
		}
		if others == 0 {
			return nil, apperror.BadRequest("Minimal harus ada satu super admin yang aktif.")
		}
	}

	target.Nama = nama
	target.Role = role
	target.IsActive = isActive
	if err := s.repo.Update(ctx, target); err != nil {
		return nil, apperror.Internal(err)
	}
	return target, nil
}

func (s *AdminService) ResetPassword(ctx context.Context, id uint, password string) error {
	target, err := s.repo.ByID(ctx, id)
	if err != nil {
		return apperror.Internal(err)
	}
	if target == nil {
		return apperror.NotFound("Akun admin")
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return apperror.Internal(err)
	}
	target.PasswordHash = string(hash)
	if err := s.repo.Update(ctx, target); err != nil {
		return apperror.Internal(err)
	}
	return nil
}

func (s *AdminService) Delete(ctx context.Context, id, actingID uint) error {
	if id == actingID {
		return apperror.BadRequest("Anda tidak bisa menghapus akun sendiri.")
	}
	target, err := s.repo.ByID(ctx, id)
	if err != nil {
		return apperror.Internal(err)
	}
	if target == nil {
		return apperror.NotFound("Akun admin")
	}
	if target.Role == entity.RoleSuperAdmin && target.IsActive {
		others, err := s.repo.CountActiveSuperAdmins(ctx, id)
		if err != nil {
			return apperror.Internal(err)
		}
		if others == 0 {
			return apperror.BadRequest("Minimal harus ada satu super admin yang aktif.")
		}
	}

	affected, err := s.repo.Delete(ctx, id)
	if err != nil {
		return apperror.Internal(err)
	}
	if affected == 0 {
		return apperror.NotFound("Akun admin")
	}
	return nil
}
