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

// applySameSite memilih atribut SameSite cookie sesi. Di produksi
// (cookieSecure=true) frontend & backend biasanya beda domain (Vercel ↔
// Railway) sehingga cookie harus SameSite=None; Secure agar terkirim
// lintas-situs. Di pengembangan cukup Lax.
func (h *AuthHandler) applySameSite(c *gin.Context) {
	if h.cookieSecure {
		c.SetSameSite(http.SameSiteNoneMode)
	} else {
		c.SetSameSite(http.SameSiteLaxMode)
	}
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
	h.applySameSite(c)
	c.SetCookie(h.cookieName, token, int(h.auth.TTL().Seconds()), "/", "", h.cookieSecure, true)

	respondData(c, http.StatusOK, dto.SessionResponse{
		Token: token,
		User: dto.AdminUserResponse{
			ID:       admin.ID,
			Nama:     admin.Nama,
			Username: admin.Username,
			Role:     admin.Role,
		},
	})
}

// POST /api/v1/auth/logout
func (h *AuthHandler) Logout(c *gin.Context) {
	h.applySameSite(c)
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
		ID:       id,
		Nama:     claims.Nama,
		Username: claims.Username,
		Role:     claims.Role,
	})
}
