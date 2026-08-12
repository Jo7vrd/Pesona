package service

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"image/jpeg"
	_ "image/png" // registrasi decoder PNG
	"io"
	"mime/multipart"
	"net/http"

	"github.com/disintegration/imaging"
	"github.com/google/uuid"
	_ "golang.org/x/image/webp" // registrasi decoder WebP

	"github.com/desakeikecil/api/internal/apperror"
	"github.com/desakeikecil/api/internal/storage"
)

const (
	// maksimal 10MB; sisi terpanjang dibatasi per-modul (lihat di bawah)
	maxUploadSize = 10 * 1024 * 1024
	jpegQuality   = 90
)

// maxDimensionFor: semua foto disimpan resolusi tinggi (2400px) agar tetap
// tajam/HD di kartu, hero, dan halaman detail — terutama setelah admin bisa
// memperbesar (zoom) bingkai foto.
func maxDimensionFor(modul string) int {
	return 2400
}

var allowedModul = map[string]bool{
	"makanan": true, "budaya": true, "destinasi": true,
	"hero": true, "umum": true,
}

type UploadService struct {
	storage storage.ObjectStorage
}

func NewUpload(store storage.ObjectStorage) *UploadService {
	return &UploadService{storage: store}
}

// Process memvalidasi (tipe via sniffing, bukan ekstensi), menyusutkan
// dimensi bila perlu, lalu menyimpan foto dan mengembalikan URL publik.
// Catatan §8.4: target format WebP; encoder WebP murni-Go belum tersedia,
// jadi keluaran distandarkan ke JPEG q85 — dimensi & bobot tetap sesuai
// anggaran performa.
func (s *UploadService) Process(ctx context.Context, modul string, file *multipart.FileHeader) (string, error) {
	if !allowedModul[modul] {
		return "", apperror.BadRequest("Modul tidak dikenal. Gunakan: makanan / budaya / destinasi / hero / umum.")
	}
	if file.Size > maxUploadSize {
		return "", apperror.BadRequest("Ukuran foto maksimal 10MB.")
	}

	f, err := file.Open()
	if err != nil {
		return "", apperror.Internal(err)
	}
	defer f.Close()

	raw, err := io.ReadAll(io.LimitReader(f, maxUploadSize+1))
	if err != nil {
		return "", apperror.Internal(err)
	}
	if len(raw) > maxUploadSize {
		return "", apperror.BadRequest("Ukuran foto maksimal 10MB.")
	}

	contentType := http.DetectContentType(raw)
	switch contentType {
	case "image/jpeg", "image/png", "image/webp":
	default:
		return "", apperror.BadRequest("Format harus JPG, PNG, atau WebP.")
	}

	img, _, err := image.Decode(bytes.NewReader(raw))
	if err != nil {
		return "", apperror.BadRequest("File bukan gambar yang valid.")
	}

	dim := maxDimensionFor(modul)
	bounds := img.Bounds()
	if bounds.Dx() > dim || bounds.Dy() > dim {
		img = imaging.Fit(img, dim, dim, imaging.Lanczos)
	}

	var out bytes.Buffer
	if err := jpeg.Encode(&out, img, &jpeg.Options{Quality: jpegQuality}); err != nil {
		return "", apperror.Internal(err)
	}

	key := fmt.Sprintf("%s/%s.jpg", modul, uuid.NewString())
	url, err := s.storage.Put(ctx, key, "image/jpeg", &out)
	if err != nil {
		return "", apperror.Internal(err)
	}
	return url, nil
}
