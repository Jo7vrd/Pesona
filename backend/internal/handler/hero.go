package handler

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/desakeikecil/api/internal/dto"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/service"
)

type HeroHandler struct {
	svc    *service.HeroService
	logger *slog.Logger
}

func NewHero(svc *service.HeroService, logger *slog.Logger) *HeroHandler {
	return &HeroHandler{svc: svc, logger: logger}
}

// GET /api/v1/hero — publik (dikonsumsi RSC beranda).
func (h *HeroHandler) List(c *gin.Context) {
	items, err := h.svc.List(c.Request.Context())
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, mapSlice(items, dto.NewHeroImageResponse))
}

// POST /api/v1/admin/hero — admin.
func (h *HeroHandler) Create(c *gin.Context) {
	var req dto.HeroImageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	item := entity.HeroImage{
		FotoURL:    req.FotoURL,
		FotoPosisi: dto.FotoPosisiOrDefault(req.FotoPosisi),
		Urutan:     req.Urutan,
	}
	if err := h.svc.Create(c.Request.Context(), &item); err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusCreated, dto.NewHeroImageResponse(item))
}

// DELETE /api/v1/admin/hero/:id — admin.
func (h *HeroHandler) Delete(c *gin.Context) {
	id, ok := paramID(c)
	if !ok {
		return
	}
	if err := h.svc.Delete(c.Request.Context(), id); err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, gin.H{"deleted": true})
}
