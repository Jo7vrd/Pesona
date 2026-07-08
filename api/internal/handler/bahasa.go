package handler

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/desakeikecil/api/internal/dto"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/service"
)

type BahasaHandler struct {
	svc    *service.ContentService[entity.BahasaLokal]
	logger *slog.Logger
}

func NewBahasa(svc *service.ContentService[entity.BahasaLokal], logger *slog.Logger) *BahasaHandler {
	return &BahasaHandler{svc: svc, logger: logger}
}

func (h *BahasaHandler) List(c *gin.Context) {
	items, err := h.svc.List(c.Request.Context())
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, mapSlice(items, dto.NewBahasaResponse))
}

func (h *BahasaHandler) Create(c *gin.Context) {
	var req dto.BahasaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	item := entity.BahasaLokal{
		BahasaIndonesia: req.BahasaIndonesia,
		BahasaKei:       req.BahasaKei,
		Catatan:         req.Catatan,
	}
	if err := h.svc.Create(c.Request.Context(), &item); err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusCreated, dto.NewBahasaResponse(item))
}

func (h *BahasaHandler) Update(c *gin.Context) {
	id, ok := paramID(c)
	if !ok {
		return
	}
	var req dto.BahasaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	item, err := h.svc.Update(c.Request.Context(), id, func(b *entity.BahasaLokal) {
		b.BahasaIndonesia = req.BahasaIndonesia
		b.BahasaKei = req.BahasaKei
		b.Catatan = req.Catatan
	})
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, dto.NewBahasaResponse(*item))
}

func (h *BahasaHandler) Delete(c *gin.Context) {
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
