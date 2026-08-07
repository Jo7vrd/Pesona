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

// snapshot mengumpulkan seluruh setelan menjadi satu respons.
func (h *SettingsHandler) snapshot(c *gin.Context) (dto.SettingsResponse, bool) {
	ctx := c.Request.Context()
	video, err := h.svc.BahasaVideo(ctx)
	if err != nil {
		respondError(c, h.logger, err)
		return dto.SettingsResponse{}, false
	}
	petaFoto, err := h.svc.PetaKarangFoto(ctx)
	if err != nil {
		respondError(c, h.logger, err)
		return dto.SettingsResponse{}, false
	}
	petaDesk, err := h.svc.PetaKarangDeskripsi(ctx)
	if err != nil {
		respondError(c, h.logger, err)
		return dto.SettingsResponse{}, false
	}
	heroes, err := h.svc.PageHeroes(ctx)
	if err != nil {
		respondError(c, h.logger, err)
		return dto.SettingsResponse{}, false
	}
	return dto.NewSettingsResponse(video, petaFoto, petaDesk, heroes), true
}

// GET /api/v1/settings — publik (dikonsumsi RSC halaman Bahasa Kei, Peta,
// dan foto hero tiap halaman modul).
func (h *SettingsHandler) Get(c *gin.Context) {
	resp, ok := h.snapshot(c)
	if !ok {
		return
	}
	respondData(c, http.StatusOK, resp)
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

	if req.PetaKarangDeskrip != nil {
		if err := h.svc.SetPetaKarangDeskripsi(ctx, *req.PetaKarangDeskrip); err != nil {
			respondError(c, h.logger, err)
			return
		}
	}

	for page, urlPtr := range req.HeroImages {
		url := ""
		if urlPtr != nil {
			url = *urlPtr
		}
		if len(url) > 500 {
			respondInvalid(c)
			return
		}
		if err := h.svc.SetPageHero(ctx, page, url); err != nil {
			respondError(c, h.logger, err)
			return
		}
	}

	resp, ok := h.snapshot(c)
	if !ok {
		return
	}
	respondData(c, http.StatusOK, resp)
}
