package storage

import (
	"context"
	"io"
)

// ObjectStorage mengabstraksi penyimpanan foto. Implementasi: Cloudflare
// R2 (produksi) dan disk lokal (pengembangan).
type ObjectStorage interface {
	// Put menyimpan objek dan mengembalikan URL publiknya.
	Put(ctx context.Context, key, contentType string, body io.Reader) (string, error)
	// Delete menghapus objek berdasarkan URL publik yang pernah
	// dikembalikan Put. URL di luar domain storage diabaikan (FR-015
	// hanya berlaku untuk aset yang kita kelola).
	Delete(ctx context.Context, publicURL string) error
}
