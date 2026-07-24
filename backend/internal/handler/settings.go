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

// GET /api/v1/settings — publik (dikonsumsi RSC halaman Bahasa Kei).
func (h *SettingsHandler) Get(c *gin.Context) {
	video, err := h.svc.BahasaVideo(c.Request.Context())
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, dto.NewSettingsResponse(video))
}

// PUT /api/v1/admin/settings — admin. Video wajib tautan YouTube; string
// kosong menghapus video (disimpan sebagai string kosong).
func (h *SettingsHandler) Update(c *gin.Context) {
	var req dto.SettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	if !normalizeVideo(c, &req.BahasaVideo) {
		return
	}
	url := ""
	if req.BahasaVideo != nil {
		url = *req.BahasaVideo
	}
	if err := h.svc.SetBahasaVideo(c.Request.Context(), url); err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, dto.NewSettingsResponse(url))
}
