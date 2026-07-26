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

type AdminUsersHandler struct {
	svc    *service.AdminService
	logger *slog.Logger
}

func NewAdminUsers(svc *service.AdminService, logger *slog.Logger) *AdminUsersHandler {
	return &AdminUsersHandler{svc: svc, logger: logger}
}

// actingID membaca ID admin yang sedang login dari JWT.
func actingID(c *gin.Context) uint {
	claims := c.MustGet(middleware.CtxClaims).(*service.Claims)
	if id, err := strconv.ParseUint(claims.Subject, 10, 32); err == nil {
		return uint(id)
	}
	return 0
}

// GET /api/v1/admin/admins
func (h *AdminUsersHandler) List(c *gin.Context) {
	items, err := h.svc.List(c.Request.Context())
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, mapSlice(items, dto.NewAdminAccountResponse))
}

// POST /api/v1/admin/admins
func (h *AdminUsersHandler) Create(c *gin.Context) {
	var req dto.CreateAdminRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	admin, err := h.svc.Create(c.Request.Context(), req.Nama, req.Username, req.Password, req.Role)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusCreated, dto.NewAdminAccountResponse(*admin))
}

// PUT /api/v1/admin/admins/:id
func (h *AdminUsersHandler) Update(c *gin.Context) {
	id, ok := paramID(c)
	if !ok {
		return
	}
	var req dto.UpdateAdminRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	admin, err := h.svc.Update(
		c.Request.Context(), id, actingID(c), req.Nama, req.Role, *req.IsActive,
	)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, dto.NewAdminAccountResponse(*admin))
}

// PUT /api/v1/admin/admins/:id/password
func (h *AdminUsersHandler) ResetPassword(c *gin.Context) {
	id, ok := paramID(c)
	if !ok {
		return
	}
	var req dto.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	if err := h.svc.ResetPassword(c.Request.Context(), id, req.Password); err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, gin.H{"reset": true})
}

// DELETE /api/v1/admin/admins/:id
func (h *AdminUsersHandler) Delete(c *gin.Context) {
	id, ok := paramID(c)
	if !ok {
		return
	}
	if err := h.svc.Delete(c.Request.Context(), id, actingID(c)); err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, gin.H{"deleted": true})
}
