package handler

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/desakeikecil/api/internal/dto"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/service"
)

type BudayaHandler struct {
	svc    *service.ContentService[entity.Budaya]
	logger *slog.Logger
}

func NewBudaya(svc *service.ContentService[entity.Budaya], logger *slog.Logger) *BudayaHandler {
	return &BudayaHandler{svc: svc, logger: logger}
}

func (h *BudayaHandler) List(c *gin.Context) {
	items, err := h.svc.List(c.Request.Context())
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, mapSlice(items, dto.NewBudayaResponse))
}

func (h *BudayaHandler) Unggulan(c *gin.Context) {
	items, err := h.svc.Unggulan(c.Request.Context())
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, mapSlice(items, dto.NewBudayaResponse))
}

func (h *BudayaHandler) ByID(c *gin.Context) {
	id, ok := paramID(c)
	if !ok {
		return
	}
	item, err := h.svc.ByID(c.Request.Context(), id)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, dto.NewBudayaResponse(*item))
}

func (h *BudayaHandler) Create(c *gin.Context) {
	var req dto.BudayaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	item := entity.Budaya{
		Nama:       req.Nama,
		Kategori:   req.Kategori,
		Deskripsi:  req.Deskripsi,
		FotoURL:    req.FotoURL,
		IsUnggulan: req.IsUnggulan,
	}
	if err := h.svc.Create(c.Request.Context(), &item); err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusCreated, dto.NewBudayaResponse(item))
}

func (h *BudayaHandler) Update(c *gin.Context) {
	id, ok := paramID(c)
	if !ok {
		return
	}
	var req dto.BudayaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	item, err := h.svc.Update(c.Request.Context(), id, func(b *entity.Budaya) {
		b.Nama = req.Nama
		b.Kategori = req.Kategori
		b.Deskripsi = req.Deskripsi
		b.FotoURL = req.FotoURL
		b.IsUnggulan = req.IsUnggulan
	})
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, dto.NewBudayaResponse(*item))
}

func (h *BudayaHandler) Delete(c *gin.Context) {
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
