package handler

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/desakeikecil/api/internal/dto"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/service"
)

type EmergencyHandler struct {
	svc    *service.EmergencyService
	logger *slog.Logger
}

func NewEmergency(svc *service.EmergencyService, logger *slog.Logger) *EmergencyHandler {
	return &EmergencyHandler{svc: svc, logger: logger}
}

// GET /api/v1/kedaruratan — publik (dikonsumsi RSC halaman Kedaruratan).
func (h *EmergencyHandler) List(c *gin.Context) {
	items, err := h.svc.List(c.Request.Context())
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, mapSlice(items, dto.NewEmergencyContactResponse))
}

// POST /api/v1/admin/kedaruratan — admin.
func (h *EmergencyHandler) Create(c *gin.Context) {
	var req dto.EmergencyContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	item := entity.EmergencyContact{
		Nama:    req.Nama,
		Peran:   req.Peran,
		Telepon: req.Telepon,
		Ikon:    req.Ikon,
		Urutan:  req.Urutan,
	}
	if err := h.svc.Create(c.Request.Context(), &item); err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusCreated, dto.NewEmergencyContactResponse(item))
}

// PUT /api/v1/admin/kedaruratan/:id — admin.
func (h *EmergencyHandler) Update(c *gin.Context) {
	id, ok := paramID(c)
	if !ok {
		return
	}
	var req dto.EmergencyContactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return
	}
	item, err := h.svc.Update(c.Request.Context(), id, func(e *entity.EmergencyContact) {
		e.Nama = req.Nama
		e.Peran = req.Peran
		e.Telepon = req.Telepon
		e.Ikon = req.Ikon
		e.Urutan = req.Urutan
	})
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, dto.NewEmergencyContactResponse(*item))
}

// DELETE /api/v1/admin/kedaruratan/:id — admin.
func (h *EmergencyHandler) Delete(c *gin.Context) {
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
