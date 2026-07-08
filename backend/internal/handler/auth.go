package handler

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/desakeikecil/api/internal/dto"
	"github.com/desakeikecil/api/internal/middleware"
	"github.com/desakeikecil/api/internal/service"
)

type AuthHandler struct {
	auth         *service.AuthService
	cookieName   string
	cookieSecure bool
	logger       *slog.Logger
}

func NewAuth(auth *service.AuthService, cookieName string, cookieSecure bool, logger *slog.Logger) *AuthHandler {
	return &AuthHandler{auth: auth, cookieName: cookieName, cookieSecure: cookieSecure, logger: logger}
}

// POST /api/v1/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}

	admin, token, err := h.auth.Login(c.Request.Context(), req)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}

	// JWT di cookie httpOnly (BR-001): tidak bisa dibaca JavaScript
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(h.cookieName, token, int(h.auth.TTL().Seconds()), "/", "", h.cookieSecure, true)

	respondData(c, http.StatusOK, dto.SessionResponse{
		Token: token,
		User: dto.AdminUserResponse{
			ID:    admin.ID,
			Nama:  admin.Nama,
			Email: admin.Email,
			Role:  admin.Role,
		},
	})
}

// POST /api/v1/auth/logout
func (h *AuthHandler) Logout(c *gin.Context) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(h.cookieName, "", -1, "/", "", h.cookieSecure, true)
	respondData(c, http.StatusOK, gin.H{"loggedOut": true})
}

// GET /api/v1/auth/me — identitas dari JWT yang tervalidasi
func (h *AuthHandler) Me(c *gin.Context) {
	claims := c.MustGet(middleware.CtxClaims).(*service.Claims)
	var id uint
	if parsed, err := strconv.ParseUint(claims.Subject, 10, 32); err == nil {
		id = uint(parsed)
	}
	respondData(c, http.StatusOK, dto.AdminUserResponse{
		ID:    id,
		Nama:  claims.Nama,
		Email: claims.Email,
		Role:  claims.Role,
	})
}
