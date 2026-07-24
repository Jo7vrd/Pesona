// Seeder idempoten: mengisi admin pertama dan konten awal Kei Kecil.
// Aman dijalankan berulang — baris yang sudah ada dilewati.
//
//	DATABASE_URL=... SEED_ADMIN_PASSWORD=... go run ./cmd/seed
package main

import (
	"log/slog"
	"os"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"github.com/desakeikecil/api/internal/config"
	"github.com/desakeikecil/api/internal/database"
	"github.com/desakeikecil/api/internal/entity"
)

func main() {
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	cfg, err := config.Load()
	if err != nil {
		logger.Error("konfigurasi", "error", err)
		os.Exit(1)
	}
	if err := database.Migrate(cfg.DatabaseURL, logger); err != nil {
		logger.Error("migrasi", "error", err)
		os.Exit(1)
	}
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		logger.Error("koneksi", "error", err)
		os.Exit(1)
	}

	if err := seedAdmin(db, logger); err != nil {
		logger.Error("seed admin", "error", err)
		os.Exit(1)
	}
	if err := seedContent(db, logger); err != nil {
		logger.Error("seed konten", "error", err)
		os.Exit(1)
	}
	logger.Info("seed selesai")
}

func seedAdmin(db *gorm.DB, logger *slog.Logger) error {
	email := getenv("SEED_ADMIN_EMAIL", "admin@keikecil.id")
	password := getenv("SEED_ADMIN_PASSWORD", "KeiKecil#2026")
	nama := getenv("SEED_ADMIN_NAMA", "Admin Desa")

	var count int64
	if err := db.Model(&entity.Admin{}).
		Where("LOWER(email) = LOWER(?)", email).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		logger.Info("admin sudah ada, dilewati", "email", email)
		return nil
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	admin := entity.Admin{
		Nama:         nama,
		Email:        strings.ToLower(email),
		PasswordHash: string(hash),
		Role:         entity.RoleSuperAdmin,
	}
	if err := db.Create(&admin).Error; err != nil {
		return err
	}
	logger.Info("admin dibuat", "email", email, "role", admin.Role)
	return nil
}

// foto: placeholder Unsplash — diganti aset R2 milik desa lewat admin.
// Konten WAJIB divalidasi perangkat desa & penutur asli sebelum produksi.
func seedContent(db *gorm.DB, logger *slog.Logger) error {
	// contoh video — ganti dengan video resmi desa lewat admin.
	videoEmbal := "https://www.youtube.com/watch?v=cbTCRM7I0f0"
	videoMeti := "https://www.youtube.com/watch?v=6jSlpxqXM-w"

	makanan := []entity.Makanan{
		{Nama: "Embal Goreng", Kategori: "kudapan", IsUnggulan: true, VideoYoutube: &videoEmbal,
			Deskripsi: "Olahan singkong khas Kepulauan Kei yang dikeringkan lalu digoreng — renyah di luar, gurih di dalam, teman minum kopi sore. Embal adalah makanan pokok masyarakat Kei yang tahan disimpan berbulan-bulan.",
			FotoURL:   "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200&q=80"},
		{Nama: "Ikan Bakar Kei", Kategori: "makanan", IsUnggulan: true,
			Deskripsi: "Ikan karang segar hasil tangkapan hari itu, dibakar dengan bumbu rica khas Maluku dan disajikan bersama embal. Nelayan Kei hanya mengambil secukupnya — kesegaran adalah bumbu utamanya.",
			FotoURL:   "https://images.unsplash.com/photo-1559847844-5315695dadae?w=1200&q=80"},
		{Nama: "Kohu-Kohu", Kategori: "makanan", IsUnggulan: true,
			Deskripsi: "Salad khas Maluku dari kelapa parut, ikan teri, dan sayuran segar dengan perasan jeruk — segar dan kaya rempah. Biasa disantap bersama embal atau kasbi rebus.",
			FotoURL:   "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"},
		{Nama: "Lad", Kategori: "makanan", IsUnggulan: true,
			Deskripsi: "Salad rumput laut segar dari perairan Kei, dibumbui kelapa parut dan cabai — hidangan pesisir yang hanya ada di sini. Rumput laut dipanen dari perairan dangkal saat meti.",
			FotoURL:   "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"},
		{Nama: "Ikan Kuah Asam", Kategori: "makanan",
			Deskripsi: "Sup ikan berkuah bening asam segar dengan belimbing wuluh dan kemangi. Hidangan rumahan Kei yang menghangatkan setelah seharian di laut.",
			FotoURL:   "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&q=80"},
		{Nama: "Embal Bunga", Kategori: "kudapan",
			Deskripsi: "Embal yang dicetak berbentuk bunga lalu dipanggang, sering disebut embal love. Kudapan manis-gurih yang jadi oleh-oleh khas dari Kei.",
			FotoURL:   "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1200&q=80"},
		{Nama: "Air Guraka", Kategori: "minuman",
			Deskripsi: "Minuman jahe hangat dengan gula aren dan taburan kenari, diwariskan lintas generasi di Maluku. Teman terbaik menikmati angin laut sore hari.",
			FotoURL:   "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&q=80"},
		{Nama: "Jus Pala", Kategori: "minuman",
			Deskripsi: "Jus segar dari daging buah pala — kekayaan rempah Maluku dalam segelas minuman. Manis, sedikit sepat, dan sangat menyegarkan di siang hari.",
			FotoURL:   "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=1200&q=80"},
	}

	budaya := []entity.Budaya{
		{Nama: "Sasi Laut", Kategori: "Tradisi konservasi", IsUnggulan: true,
			Deskripsi: "Larangan adat memanen hasil laut pada waktu dan wilayah tertentu. Sasi menjaga terumbu karang dan populasi ikan Kei tetap lestari selama ratusan tahun — kearifan lokal yang kini diakui sebagai praktik konservasi modern. Pelanggaran sasi diselesaikan lewat musyawarah adat.",
			FotoURL:   "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80"},
		{Nama: "Larvul Ngabal", Kategori: "Hukum adat", IsUnggulan: true,
			Deskripsi: "Hukum adat tertua Kepulauan Kei — 'darah merah dan tombak dari Bali' — yang mengatur harmoni sosial, penghormatan pada sesama, dan hak atas tanah. Masih menjadi pegangan hidup masyarakat Kei hingga hari ini.",
			FotoURL:   "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=1600&q=80"},
		{Nama: "Festival Meti Kei", Kategori: "Festival", VideoYoutube: &videoMeti,
			Deskripsi: "Pesta rakyat tahunan menyambut meti — surutnya air laut ekstrem yang membuka hamparan pasir luas. Warga menangkap ikan bersama, menggelar bazar kuliner, dan menampilkan seni tradisi di atas laut yang surut.",
			FotoURL:   "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=1600&q=80"},
		{Nama: "Ohoi", Kategori: "Tatanan adat",
			Deskripsi: "Kampung adat Kei dengan struktur pemerintahan tradisionalnya sendiri. Setiap ohoi memiliki hak ulayat, kepala adat, dan aturan yang hidup berdampingan dengan pemerintahan desa modern.",
			FotoURL:   "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=1600&q=80"},
		{Nama: "Anyaman Daun Kelapa", Kategori: "Kerajinan",
			Deskripsi: "Keterampilan menganyam daun kelapa menjadi tikar, bakul, dan atap — pengetahuan sehari-hari yang diwariskan dari nenek ke cucu di setiap ohoi pesisir.",
			FotoURL:   "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1600&q=80"},
	}

	catatanMeti := "Fenomena surut ekstrem yang dirayakan dalam Festival Meti Kei"
	catatanEvav := "Evav adalah sebutan orang Kei untuk tanah kelahirannya"
	catatanAin := "Semboyan persaudaraan masyarakat Kei"
	bahasa := []entity.BahasaLokal{
		{BahasaIndonesia: "Pulau", BahasaKei: "Nuhu"},
		{BahasaIndonesia: "Laut", BahasaKei: "Roa"},
		{BahasaIndonesia: "Ikan", BahasaKei: "Vu'ut"},
		{BahasaIndonesia: "Ayam", BahasaKei: "Manut"},
		{BahasaIndonesia: "Telur", BahasaKei: "Tilur"},
		{BahasaIndonesia: "Darah", BahasaKei: "Lar"},
		{BahasaIndonesia: "Merah", BahasaKei: "Vul"},
		{BahasaIndonesia: "Tombak", BahasaKei: "Ngab"},
		{BahasaIndonesia: "Air surut (meti)", BahasaKei: "Met", Catatan: &catatanMeti},
		{BahasaIndonesia: "Kampung", BahasaKei: "Ohoi"},
		{BahasaIndonesia: "Kepulauan Kei", BahasaKei: "Nuhu Evav", Catatan: &catatanEvav},
		{BahasaIndonesia: "Satu untuk semua, semua untuk satu", BahasaKei: "Ain ni ain", Catatan: &catatanAin},
	}

	// video: contoh tautan YouTube — ganti dengan video resmi desa
	// lewat admin. Koordinat perkiraan, verifikasi lapangan.
	videoNgurbloat := "https://www.youtube.com/watch?v=C6RADZ_om4k"
	videoHawang := "https://www.youtube.com/watch?v=fDBnSPR9_l4"
	destinasi := []entity.Destinasi{
		{Nama: "Pantai Ngurbloat (Pasir Panjang)", Jenis: "Pantai",
			Lat: -5.66, Lng: 132.641, VideoYoutube: &videoNgurbloat,
			Deskripsi: "Tiga kilometer pasir putih sehalus tepung, kerap disebut pasir terhalus di Asia. Landai dan aman untuk berenang keluarga.",
			FotoURL:   "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1600&q=80"},
		{Nama: "Pantai Ohoidertawun", Jenis: "Pantai",
			Lat: -5.624, Lng: 132.712,
			Deskripsi: "Saat meti, air surut hingga ratusan meter dan membuka hamparan pasir luas. Tempat terbaik menikmati matahari terbenam.",
			FotoURL:   "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=1600&q=80"},
		{Nama: "Goa Hawang", Jenis: "Gua",
			Lat: -5.741, Lng: 132.67, VideoYoutube: &videoHawang,
			Deskripsi: "Gua dengan kolam air payau sebening kristal berwarna biru kehijauan. Berenang di sini terasa seperti di akuarium alami.",
			FotoURL:   "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80"},
		{Nama: "Ngurtavur", Jenis: "Snorkeling",
			Lat: -5.834, Lng: 132.51,
			Deskripsi: "Pasir timbul sepanjang dua kilometer yang muncul saat surut, tempat singgah burung pelikan. Terumbu karang di sekitarnya masih perawan.",
			FotoURL:   "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=1600&q=80"},
		{Nama: "Pantai Perwira", Jenis: "Pantai",
			Lat: -5.62, Lng: 132.655,
			Deskripsi: "Pasir putih yang diapit karang dan hutan pantai yang rimbun. Debur ombaknya memecah di batu karang, spot favorit menikmati senja dalam ketenangan.",
			FotoURL:   "https://images.unsplash.com/photo-1546484475-7f7bd55792da?w=1600&q=80"},
		{Nama: "Pulau Bair", Jenis: "Pulau",
			Lat: -5.405, Lng: 132.686,
			Deskripsi: "Laguna tersembunyi di antara tebing karst, sering dijuluki Raja Ampat kecil. Perairan tenang dengan visibilitas snorkeling luar biasa.",
			FotoURL:   "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1600&q=80"},
	}

	// ON CONFLICT DO NOTHING pada indeks unik LOWER() tidak didukung
	// clause GORM secara langsung, jadi cek eksistensi per baris.
	for _, m := range makanan {
		if err := insertIfMissing(db, "makanan", "nama", m.Nama, &m); err != nil {
			return err
		}
		if err := backfillVideo(db, "makanan", m.Nama, m.VideoYoutube); err != nil {
			return err
		}
	}
	for _, b := range budaya {
		if err := insertIfMissing(db, "budaya", "nama", b.Nama, &b); err != nil {
			return err
		}
		if err := backfillVideo(db, "budaya", b.Nama, b.VideoYoutube); err != nil {
			return err
		}
	}
	for _, b := range bahasa {
		if err := insertIfMissing(db, "bahasa_lokal", "bahasa_indonesia", b.BahasaIndonesia, &b); err != nil {
			return err
		}
	}

	for _, d := range destinasi {
		if err := insertIfMissing(db, "destinasi", "nama", d.Nama, &d); err != nil {
			return err
		}
		if err := backfillVideo(db, "destinasi", d.Nama, d.VideoYoutube); err != nil {
			return err
		}
	}

	// Video halaman Bahasa Kei (setelan tingkat-situs) — contoh; diganti
	// operator desa lewat admin. Diisi hanya bila belum ada.
	if err := seedSettingIfMissing(db, entity.SettingBahasaVideo,
		"https://www.youtube.com/watch?v=k81PbidCf74"); err != nil {
		return err
	}

	logger.Info("konten awal terpasang",
		"makanan", len(makanan), "budaya", len(budaya),
		"bahasa", len(bahasa), "destinasi", len(destinasi))
	return nil
}

// backfillVideo mengisi kolom video_youtube untuk baris lama yang belum
// punya video (insertIfMissing melewatkannya), tanpa menimpa nilai yang
// sudah diubah admin.
func backfillVideo(db *gorm.DB, table, nama string, video *string) error {
	if video == nil {
		return nil
	}
	return db.Table(table).
		Where("LOWER(nama) = LOWER(?) AND video_youtube IS NULL", nama).
		Update("video_youtube", *video).Error
}

func seedSettingIfMissing(db *gorm.DB, key, value string) error {
	var count int64
	if err := db.Table("settings").Where("key = ?", key).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return nil
	}
	return db.Create(&entity.Setting{Key: key, Value: value}).Error
}

func insertIfMissing(db *gorm.DB, table, column, value string, row any) error {
	var count int64
	if err := db.Table(table).
		Where("LOWER("+column+") = LOWER(?)", value).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return nil
	}
	return db.Clauses(clause.OnConflict{DoNothing: true}).Create(row).Error
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
