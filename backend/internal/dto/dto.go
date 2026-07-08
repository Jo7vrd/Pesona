package dto

import (
	"time"

	"github.com/desakeikecil/api/internal/entity"
)

// Nama field JSON mengikuti kontrak frontend (web/lib/types.ts) persis.

type MakananRequest struct {
	Nama       string `json:"nama" binding:"required,min=3,max=100"`
	Kategori   string `json:"kategori" binding:"required,oneof=makanan minuman kudapan"`
	Deskripsi  string `json:"deskripsi" binding:"required,min=20,max=1000"`
	FotoURL    string `json:"fotoUrl" binding:"required,max=500"`
	IsUnggulan bool   `json:"isUnggulan"`
}

type MakananResponse struct {
	ID         uint   `json:"id"`
	Nama       string `json:"nama"`
	Kategori   string `json:"kategori"`
	Deskripsi  string `json:"deskripsi"`
	FotoURL    string `json:"fotoUrl"`
	IsUnggulan bool   `json:"isUnggulan"`
}

func NewMakananResponse(m entity.Makanan) MakananResponse {
	return MakananResponse{
		ID:         m.ID,
		Nama:       m.Nama,
		Kategori:   m.Kategori,
		Deskripsi:  m.Deskripsi,
		FotoURL:    m.FotoURL,
		IsUnggulan: m.IsUnggulan,
	}
}

type BudayaRequest struct {
	Nama       string `json:"nama" binding:"required,min=3,max=100"`
	Kategori   string `json:"kategori" binding:"required,min=3,max=50"`
	Deskripsi  string `json:"deskripsi" binding:"required,min=20,max=2000"`
	FotoURL    string `json:"fotoUrl" binding:"required,max=500"`
	IsUnggulan bool   `json:"isUnggulan"`
}

type BudayaResponse struct {
	ID         uint   `json:"id"`
	Nama       string `json:"nama"`
	Kategori   string `json:"kategori"`
	Deskripsi  string `json:"deskripsi"`
	FotoURL    string `json:"fotoUrl"`
	IsUnggulan bool   `json:"isUnggulan"`
}

func NewBudayaResponse(b entity.Budaya) BudayaResponse {
	return BudayaResponse{
		ID:         b.ID,
		Nama:       b.Nama,
		Kategori:   b.Kategori,
		Deskripsi:  b.Deskripsi,
		FotoURL:    b.FotoURL,
		IsUnggulan: b.IsUnggulan,
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
	Makanan ModuleStats `json:"makanan"`
	Budaya  ModuleStats `json:"budaya"`
	Bahasa  ModuleStats `json:"bahasa"`
}

type UploadResponse struct {
	URL string `json:"url"`
}
