package entity

import "time"

// Entitas mengikuti skema PRD §8.3. Nama kolom snake_case dikelola GORM;
// constraint (unique LOWER(nama), CHECK kategori) ada di migrasi SQL.

type Makanan struct {
	ID           uint    `gorm:"primaryKey"`
	Nama         string  `gorm:"size:100;not null"`
	Kategori     string  `gorm:"size:20;not null"`
	Deskripsi    string  `gorm:"type:text;not null"`
	FotoURL      string  `gorm:"size:500;not null;column:foto_url"`
	IsUnggulan   bool    `gorm:"not null;default:false"`
	VideoYoutube *string `gorm:"size:500;column:video_youtube"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (Makanan) TableName() string { return "makanan" }

type Budaya struct {
	ID           uint    `gorm:"primaryKey"`
	Nama         string  `gorm:"size:100;not null"`
	Kategori     string  `gorm:"size:50;not null"`
	Deskripsi    string  `gorm:"type:text;not null"`
	FotoURL      string  `gorm:"size:500;not null;column:foto_url"`
	IsUnggulan   bool    `gorm:"not null;default:false"`
	VideoYoutube *string `gorm:"size:500;column:video_youtube"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (Budaya) TableName() string { return "budaya" }

type BahasaLokal struct {
	ID              uint    `gorm:"primaryKey"`
	BahasaIndonesia string  `gorm:"size:150;not null"`
	BahasaKei       string  `gorm:"size:150;not null"`
	Catatan         *string `gorm:"type:text"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

func (BahasaLokal) TableName() string { return "bahasa_lokal" }

type Destinasi struct {
	ID           uint    `gorm:"primaryKey"`
	Nama         string  `gorm:"size:100;not null"`
	Jenis        string  `gorm:"size:20;not null"`
	Deskripsi    string  `gorm:"type:text;not null"`
	Lat          float64 `gorm:"not null"`
	Lng          float64 `gorm:"not null"`
	FotoURL      string  `gorm:"size:500;not null;column:foto_url"`
	VideoYoutube *string `gorm:"size:500;column:video_youtube"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (Destinasi) TableName() string { return "destinasi" }

// Setting menyimpan setelan tingkat-situs sebagai pasangan kunci-nilai
// (mis. "bahasa_video" → tautan YouTube halaman Bahasa Kei).
type Setting struct {
	Key       string `gorm:"primaryKey;size:50;column:key"`
	Value     string `gorm:"type:text;not null"`
	UpdatedAt time.Time
}

func (Setting) TableName() string { return "settings" }

// Kunci setelan yang dikenal.
const SettingBahasaVideo = "bahasa_video"

const (
	RoleSuperAdmin = "super_admin"
	RoleAdmin      = "admin"
)

type Admin struct {
	ID           uint   `gorm:"primaryKey"`
	Nama         string `gorm:"size:100;not null"`
	Email        string `gorm:"size:150;not null;uniqueIndex"`
	PasswordHash string `gorm:"size:100;not null"`
	Role         string `gorm:"size:20;not null;default:admin"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (Admin) TableName() string { return "admins" }
