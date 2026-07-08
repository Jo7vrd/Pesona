package handler

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/desakeikecil/api/internal/dto"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/service"
)

type MakananHandler struct {
	svc    *service.ContentService[entity.Makanan]
	logger *slog.Logger
}

func NewMakanan(svc *service.ContentService[entity.Makanan], logger *slog.Logger) *MakananHandler {
	return &MakananHandler{svc: svc, logger: logger}
}

func (h *MakananHandler) List(c *gin.Context) {
	items, err := h.svc.List(c.Request.Context())
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, mapSlice(items, dto.NewMakananResponse))
}

func (h *MakananHandler) Unggulan(c *gin.Context) {
	items, err := h.svc.Unggulan(c.Request.Context())
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, mapSlice(items, dto.NewMakananResponse))
}

func (h *MakananHandler) ByID(c *gin.Context) {
	id, ok := paramID(c)
	if !ok {
		return
	}
	item, err := h.svc.ByID(c.Request.Context(), id)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, dto.NewMakananResponse(*item))
}

func (h *MakananHandler) Create(c *gin.Context) {
	var req dto.MakananRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	item := entity.Makanan{
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
	respondData(c, http.StatusCreated, dto.NewMakananResponse(item))
}

func (h *MakananHandler) Update(c *gin.Context) {
	id, ok := paramID(c)
	if !ok {
		return
	}
	var req dto.MakananRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	item, err := h.svc.Update(c.Request.Context(), id, func(m *entity.Makanan) {
		m.Nama = req.Nama
		m.Kategori = req.Kategori
		m.Deskripsi = req.Deskripsi
		m.FotoURL = req.FotoURL
		m.IsUnggulan = req.IsUnggulan
	})
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, dto.NewMakananResponse(*item))
}

func (h *MakananHandler) Delete(c *gin.Context) {
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

func mapSlice[T any, R any](items []T, fn func(T) R) []R {
	out := make([]R, len(items))
	for i, item := range items {
		out[i] = fn(item)
	}
	return out
}
