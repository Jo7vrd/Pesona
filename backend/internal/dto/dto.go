package dto

import (
	"regexp"
	"time"

	"github.com/desakeikecil/api/internal/entity"
)

// Nama field JSON mengikuti kontrak frontend (web/lib/types.ts) persis.

type MakananRequest struct {
	Nama         string  `json:"nama" binding:"required,min=3,max=100"`
	Kategori     string  `json:"kategori" binding:"required,oneof=makanan minuman kudapan"`
	Deskripsi    string  `json:"deskripsi" binding:"required,min=20,max=1000"`
	FotoURL      string  `json:"fotoUrl" binding:"required,max=500"`
	IsUnggulan   bool    `json:"isUnggulan"`
	VideoYoutube *string `json:"videoYoutube" binding:"omitempty,max=500"`
}

type MakananResponse struct {
	ID           uint    `json:"id"`
	Nama         string  `json:"nama"`
	Kategori     string  `json:"kategori"`
	Deskripsi    string  `json:"deskripsi"`
	FotoURL      string  `json:"fotoUrl"`
	IsUnggulan   bool    `json:"isUnggulan"`
	VideoYoutube *string `json:"videoYoutube,omitempty"`
}

func NewMakananResponse(m entity.Makanan) MakananResponse {
	return MakananResponse{
		ID:           m.ID,
		Nama:         m.Nama,
		Kategori:     m.Kategori,
		Deskripsi:    m.Deskripsi,
		FotoURL:      m.FotoURL,
		IsUnggulan:   m.IsUnggulan,
		VideoYoutube: m.VideoYoutube,
	}
}

type BudayaRequest struct {
	Nama         string  `json:"nama" binding:"required,min=3,max=100"`
	Kategori     string  `json:"kategori" binding:"required,min=3,max=50"`
	Deskripsi    string  `json:"deskripsi" binding:"required,min=20,max=2000"`
	FotoURL      string  `json:"fotoUrl" binding:"required,max=500"`
	IsUnggulan   bool    `json:"isUnggulan"`
	VideoYoutube *string `json:"videoYoutube" binding:"omitempty,max=500"`
}

type BudayaResponse struct {
	ID           uint    `json:"id"`
	Nama         string  `json:"nama"`
	Kategori     string  `json:"kategori"`
	Deskripsi    string  `json:"deskripsi"`
	FotoURL      string  `json:"fotoUrl"`
	IsUnggulan   bool    `json:"isUnggulan"`
	VideoYoutube *string `json:"videoYoutube,omitempty"`
}

func NewBudayaResponse(b entity.Budaya) BudayaResponse {
	return BudayaResponse{
		ID:           b.ID,
		Nama:         b.Nama,
		Kategori:     b.Kategori,
		Deskripsi:    b.Deskripsi,
		FotoURL:      b.FotoURL,
		IsUnggulan:   b.IsUnggulan,
		VideoYoutube: b.VideoYoutube,
	}
}

type BahasaRequest struct {
	BahasaIndonesia string  `json:"bahasaIndonesia" binding:"required,min=1,max=150"`
	BahasaKei       string  `json:"bahasaKei" binding:"required,min=1,max=150"`
	Catatan         *string `json:"catatan" binding:"omitempty,max=500"`
}

type BahasaResponse struct {
	ID              uint    `json:"id"`
	BahasaIndonesia string  `json:"bahasaIndonesia"`
	BahasaKei       string  `json:"bahasaKei"`
	Catatan         *string `json:"catatan,omitempty"`
}

func NewBahasaResponse(b entity.BahasaLokal) BahasaResponse {
	return BahasaResponse{
		ID:              b.ID,
		BahasaIndonesia: b.BahasaIndonesia,
		BahasaKei:       b.BahasaKei,
		Catatan:         b.Catatan,
	}
}

// youtubeURLRe menerima tautan tontonan YouTube saja (bukan penyedia
// lain): youtube.com/watch?v=, youtu.be/, youtube.com/shorts|embed.
var youtubeURLRe = regexp.MustCompile(
	`^https?://((www|m)\.)?(youtube\.com/(watch\?v=|shorts/|embed/)|youtu\.be/)[A-Za-z0-9_-]{6,}`,
)

// ValidYouTubeURL memvalidasi tautan video destinasi (FR video).
func ValidYouTubeURL(url string) bool {
	return youtubeURLRe.MatchString(url)
}

type DestinasiRequest struct {
	Nama         string  `json:"nama" binding:"required,min=3,max=100"`
	Jenis        string  `json:"jenis" binding:"required,oneof=Pantai Snorkeling Gua Pulau"`
	Deskripsi    string  `json:"deskripsi" binding:"required,min=20,max=1000"`
	Lat          float64 `json:"lat" binding:"required,gte=-90,lte=90"`
	Lng          float64 `json:"lng" binding:"required,gte=-180,lte=180"`
	FotoURL      string  `json:"fotoUrl" binding:"required,max=500"`
	VideoYoutube *string `json:"videoYoutube" binding:"omitempty,max=500"`
}

type DestinasiResponse struct {
	ID           uint    `json:"id"`
	Nama         string  `json:"nama"`
	Jenis        string  `json:"jenis"`
	Deskripsi    string  `json:"deskripsi"`
	Lat          float64 `json:"lat"`
	Lng          float64 `json:"lng"`
	FotoURL      string  `json:"fotoUrl"`
	VideoYoutube *string `json:"videoYoutube,omitempty"`
}

func NewDestinasiResponse(d entity.Destinasi) DestinasiResponse {
	return DestinasiResponse{
		ID:           d.ID,
		Nama:         d.Nama,
		Jenis:        d.Jenis,
		Deskripsi:    d.Deskripsi,
		Lat:          d.Lat,
		Lng:          d.Lng,
		FotoURL:      d.FotoURL,
		VideoYoutube: d.VideoYoutube,
	}
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

type AdminUserResponse struct {
	ID    uint   `json:"id"`
	Nama  string `json:"nama"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type SessionResponse struct {
	Token string            `json:"token"`
	User  AdminUserResponse `json:"user"`
}

type ModuleStats struct {
	Total              int64      `json:"total"`
	TerakhirDiperbarui *time.Time `json:"terakhirDiperbarui"`
}

type DashboardStats struct {
	Makanan   ModuleStats `json:"makanan"`
	Budaya    ModuleStats `json:"budaya"`
	Bahasa    ModuleStats `json:"bahasa"`
	Destinasi ModuleStats `json:"destinasi"`
}

type UploadResponse struct {
	URL string `json:"url"`
}

// Setelan situs. bahasaVideo opsional; string kosong → NULL/none.
type SettingsRequest struct {
	BahasaVideo *string `json:"bahasaVideo" binding:"omitempty,max=500"`
}

type SettingsResponse struct {
	BahasaVideo *string `json:"bahasaVideo"`
}

func NewSettingsResponse(bahasaVideo string) SettingsResponse {
	if bahasaVideo == "" {
		return SettingsResponse{BahasaVideo: nil}
	}
	return SettingsResponse{BahasaVideo: &bahasaVideo}
}
