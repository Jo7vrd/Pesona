package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
)

// LocalStorage menyimpan file di disk untuk pengembangan tanpa R2.
// File disajikan router lewat rute statis /uploads.
type LocalStorage struct {
	dir     string
	baseURL string // mis. http://localhost:8080/uploads
}

func NewLocal(dir, baseURL string) (*LocalStorage, error) {
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return nil, fmt.Errorf("membuat direktori upload: %w", err)
	}
	return &LocalStorage{dir: dir, baseURL: strings.TrimRight(baseURL, "/")}, nil
}

func (s *LocalStorage) Put(ctx context.Context, key, contentType string, body io.Reader) (string, error) {
	path := filepath.Join(s.dir, filepath.FromSlash(key))
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return "", err
	}
	f, err := os.Create(path)
	if err != nil {
		return "", err
	}
	defer f.Close()
	if _, err := io.Copy(f, body); err != nil {
		return "", err
	}
	return s.baseURL + "/" + key, nil
}

func (s *LocalStorage) Delete(ctx context.Context, publicURL string) error {
	key, ok := strings.CutPrefix(publicURL, s.baseURL+"/")
	if !ok {
		return nil // bukan aset kelolaan kita
	}
	path := filepath.Join(s.dir, filepath.FromSlash(key))
	if err := os.Remove(path); err != nil && !os.IsNotExist(err) {
		return err
	}
	return nil
}
