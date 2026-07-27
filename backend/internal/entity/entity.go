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

// HeroImage adalah satu foto latar carousel hero beranda. Urutan
// menentukan giliran tampil; foto berganti otomatis di sisi frontend.
type HeroImage struct {
	ID        uint   `gorm:"primaryKey"`
	FotoURL   string `gorm:"size:500;not null;column:foto_url"`
	Urutan    int    `gorm:"not null;default:0"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (HeroImage) TableName() string { return "hero_images" }

// Setting menyimpan setelan tingkat-situs sebagai pasangan kunci-nilai
// (mis. "bahasa_video" → tautan YouTube halaman Bahasa Kei).
type Setting struct {
	Key       string `gorm:"primaryKey;size:50;column:key"`
	Value     string `gorm:"type:text;not null"`
	UpdatedAt time.Time
}

func (Setting) TableName() string { return "settings" }

// Kunci setelan yang dikenal.
const (
	SettingBahasaVideo    = "bahasa_video"
	SettingPetaKarangFoto = "peta_karang_foto"
)

// PageHeroPages adalah halaman modul yang foto hero-nya bisa diedit
// admin. Disimpan di tabel settings dengan kunci "hero_<slug>".
var PageHeroPages = []string{
	"destinasi", "makanan", "budaya", "bahasa", "peta", "kedaruratan",
}

func PageHeroKey(page string) string { return "hero_" + page }

func IsPageHeroPage(page string) bool {
	for _, p := range PageHeroPages {
		if p == page {
			return true
		}
	}
	return false
}

const (
	RoleSuperAdmin = "super_admin"
	RoleAdmin      = "admin"
)

type Admin struct {
	ID           uint   `gorm:"primaryKey"`
	Nama         string `gorm:"size:100;not null"`
	Username     string `gorm:"size:50;not null;uniqueIndex;column:username"`
	PasswordHash string `gorm:"size:100;not null"`
	Role         string `gorm:"size:20;not null;default:admin"`
	IsActive     bool   `gorm:"not null;default:true;column:is_active"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (Admin) TableName() string { return "admins" }
