package handler

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/desakeikecil/api/internal/dto"
	"github.com/desakeikecil/api/internal/service"
)

type SettingsHandler struct {
	svc    *service.SettingsService
	logger *slog.Logger
}

func NewSettings(svc *service.SettingsService, logger *slog.Logger) *SettingsHandler {
	return &SettingsHandler{svc: svc, logger: logger}
}

// GET /api/v1/settings — publik (dikonsumsi RSC halaman Bahasa Kei & Peta).
func (h *SettingsHandler) Get(c *gin.Context) {
	ctx := c.Request.Context()
	video, err := h.svc.BahasaVideo(ctx)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	petaFoto, err := h.svc.PetaKarangFoto(ctx)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, dto.NewSettingsResponse(video, petaFoto))
}

// PUT /api/v1/admin/settings — admin. Pembaruan bersifat parsial: hanya
// field yang disertakan (non-null) yang diubah. Video wajib tautan
// YouTube; foto peta karang berupa URL biasa. String kosong menghapus.
func (h *SettingsHandler) Update(c *gin.Context) {
	var req dto.SettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	ctx := c.Request.Context()

	if req.BahasaVideo != nil {
		if !normalizeVideo(c, &req.BahasaVideo) {
			return
		}
		url := ""
		if req.BahasaVideo != nil {
			url = *req.BahasaVideo
		}
		if err := h.svc.SetBahasaVideo(ctx, url); err != nil {
			respondError(c, h.logger, err)
			return
		}
	}

	if req.PetaKarangFoto != nil {
		if err := h.svc.SetPetaKarangFoto(ctx, *req.PetaKarangFoto); err != nil {
			respondError(c, h.logger, err)
			return
		}
	}

	// Kembalikan snapshot terbaru kedua field.
	video, err := h.svc.BahasaVideo(ctx)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	petaFoto, err := h.svc.PetaKarangFoto(ctx)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, dto.NewSettingsResponse(video, petaFoto))
}
