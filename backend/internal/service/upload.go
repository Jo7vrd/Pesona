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
	// §8.4: maksimal 5MB, sisi terpanjang 800px
	maxUploadSize = 5 * 1024 * 1024
	maxDimension  = 800
	jpegQuality   = 85
)

var allowedModul = map[string]bool{"makanan": true, "budaya": true, "destinasi": true}

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
		return "", apperror.BadRequest("Modul tidak dikenal. Gunakan: makanan / budaya / destinasi.")
	}
	if file.Size > maxUploadSize {
		return "", apperror.BadRequest("Ukuran foto maksimal 5MB.")
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
		return "", apperror.BadRequest("Ukuran foto maksimal 5MB.")
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

	bounds := img.Bounds()
	if bounds.Dx() > maxDimension || bounds.Dy() > maxDimension {
		img = imaging.Fit(img, maxDimension, maxDimension, imaging.Lanczos)
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
