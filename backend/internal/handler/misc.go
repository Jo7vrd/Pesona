package handler

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/desakeikecil/api/internal/dto"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/service"
)

type StatsHandler struct {
	makanan *service.ContentService[entity.Makanan]
	budaya  *service.ContentService[entity.Budaya]
	bahasa  *service.ContentService[entity.BahasaLokal]
	logger  *slog.Logger
}

func NewStats(
	makanan *service.ContentService[entity.Makanan],
	budaya *service.ContentService[entity.Budaya],
	bahasa *service.ContentService[entity.BahasaLokal],
	logger *slog.Logger,
) *StatsHandler {
	return &StatsHandler{makanan: makanan, budaya: budaya, bahasa: bahasa, logger: logger}
}

// GET /api/v1/admin/stats — kartu statistik dashboard (§7.2)
func (h *StatsHandler) Dashboard(c *gin.Context) {
	ctx := c.Request.Context()
	stats := dto.DashboardStats{}

	collect := func(total int64, last *time.Time) dto.ModuleStats {
		return dto.ModuleStats{Total: total, TerakhirDiperbarui: last}
	}

	total, last, err := h.makanan.Stats(ctx)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	stats.Makanan = collect(total, last)

	total, last, err = h.budaya.Stats(ctx)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	stats.Budaya = collect(total, last)

	total, last, err = h.bahasa.Stats(ctx)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	stats.Bahasa = collect(total, last)

	respondData(c, http.StatusOK, stats)
}

type UploadHandler struct {
	svc    *service.UploadService
	logger *slog.Logger
}

func NewUploadHandler(svc *service.UploadService, logger *slog.Logger) *UploadHandler {
	return &UploadHandler{svc: svc, logger: logger}
}

// POST /api/v1/admin/upload — multipart: foto (file), modul (makanan|budaya)
func (h *UploadHandler) Upload(c *gin.Context) {
	file, err := c.FormFile("foto")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Sertakan file pada field \"foto\"."})
		return
	}
	url, err := h.svc.Process(c.Request.Context(), c.PostForm("modul"), file)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusCreated, dto.UploadResponse{URL: url})
}

func Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
