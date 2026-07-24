package handler

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/desakeikecil/api/internal/dto"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/service"
)

type DestinasiHandler struct {
	svc    *service.ContentService[entity.Destinasi]
	logger *slog.Logger
}

func NewDestinasi(svc *service.ContentService[entity.Destinasi], logger *slog.Logger) *DestinasiHandler {
	return &DestinasiHandler{svc: svc, logger: logger}
}

func (h *DestinasiHandler) List(c *gin.Context) {
	items, err := h.svc.List(c.Request.Context())
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, mapSlice(items, dto.NewDestinasiResponse))
}

func (h *DestinasiHandler) ByID(c *gin.Context) {
	id, ok := paramID(c)
	if !ok {
		return
	}
	item, err := h.svc.ByID(c.Request.Context(), id)
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, dto.NewDestinasiResponse(*item))
}

// bindDestinasi memvalidasi payload; video wajib tautan YouTube (bukan
// penyedia lain) dan string kosong dinormalkan menjadi NULL.
func bindDestinasi(c *gin.Context) (*dto.DestinasiRequest, bool) {
	var req dto.DestinasiRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		respondInvalid(c)
		return nil, false
	}
	if !normalizeVideo(c, &req.VideoYoutube) {
		return nil, false
	}
	return &req, true
}

func (h *DestinasiHandler) Create(c *gin.Context) {
	req, ok := bindDestinasi(c)
	if !ok {
		return
	}
	item := entity.Destinasi{
		Nama:         req.Nama,
		Jenis:        req.Jenis,
		Deskripsi:    req.Deskripsi,
		Lat:          req.Lat,
		Lng:          req.Lng,
		FotoURL:      req.FotoURL,
		VideoYoutube: req.VideoYoutube,
	}
	if err := h.svc.Create(c.Request.Context(), &item); err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusCreated, dto.NewDestinasiResponse(item))
}

func (h *DestinasiHandler) Update(c *gin.Context) {
	id, ok := paramID(c)
	if !ok {
		return
	}
	req, ok := bindDestinasi(c)
	if !ok {
		return
	}
	item, err := h.svc.Update(c.Request.Context(), id, func(d *entity.Destinasi) {
		d.Nama = req.Nama
		d.Jenis = req.Jenis
		d.Deskripsi = req.Deskripsi
		d.Lat = req.Lat
		d.Lng = req.Lng
		d.FotoURL = req.FotoURL
		d.VideoYoutube = req.VideoYoutube
	})
	if err != nil {
		respondError(c, h.logger, err)
		return
	}
	respondData(c, http.StatusOK, dto.NewDestinasiResponse(*item))
}

func (h *DestinasiHandler) Delete(c *gin.Context) {
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
