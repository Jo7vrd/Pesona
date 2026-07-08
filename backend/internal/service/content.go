package service

import (
	"context"
	"log/slog"
	"time"

	"github.com/desakeikecil/api/internal/apperror"
	"github.com/desakeikecil/api/internal/repository"
	"github.com/desakeikecil/api/internal/revalidate"
	"github.com/desakeikecil/api/internal/storage"
)

// ContentService memusatkan aturan bisnis ketiga modul konten:
// cek duplikat nama (FR-014), hapus foto saat entri dihapus (FR-015),
// dan pemicu revalidasi cache frontend setelah mutasi.
type ContentService[T any] struct {
	repo        repository.ContentRepository[T]
	uniqueValue func(*T) string
	fotoURL     func(*T) string // nil bila modul tidak punya foto
	label       string          // untuk pesan error: "Sajian", "Budaya", "Kosakata"
	tag         string          // cache tag Next.js: makanan | budaya | bahasa
	storage     storage.ObjectStorage
	reval       *revalidate.Client
	logger      *slog.Logger
}

func NewContent[T any](
	repo repository.ContentRepository[T],
	uniqueValue func(*T) string,
	fotoURL func(*T) string,
	label, tag string,
	store storage.ObjectStorage,
	reval *revalidate.Client,
	logger *slog.Logger,
) *ContentService[T] {
	return &ContentService[T]{
		repo:        repo,
		uniqueValue: uniqueValue,
		fotoURL:     fotoURL,
		label:       label,
		tag:         tag,
		storage:     store,
		reval:       reval,
		logger:      logger,
	}
}

func (s *ContentService[T]) List(ctx context.Context) ([]T, error) {
	items, err := s.repo.List(ctx)
	if err != nil {
		return nil, apperror.Internal(err)
	}
	return items, nil
}

func (s *ContentService[T]) Unggulan(ctx context.Context) ([]T, error) {
	items, err := s.repo.Unggulan(ctx)
	if err != nil {
		return nil, apperror.Internal(err)
	}
	return items, nil
}

func (s *ContentService[T]) ByID(ctx context.Context, id uint) (*T, error) {
	item, err := s.repo.ByID(ctx, id)
	if err != nil {
		return nil, apperror.Internal(err)
	}
	if item == nil {
		return nil, apperror.NotFound(s.label)
	}
	return item, nil
}

func (s *ContentService[T]) Create(ctx context.Context, item *T) error {
	if err := s.ensureUnique(ctx, item, 0); err != nil {
		return err
	}
	if err := s.repo.Create(ctx, item); err != nil {
		return apperror.Internal(err)
	}
	s.reval.Trigger(s.tag)
	return nil
}

func (s *ContentService[T]) Update(ctx context.Context, id uint, apply func(*T)) (*T, error) {
	existing, err := s.ByID(ctx, id)
	if err != nil {
		return nil, err
	}

	fotoLama := ""
	if s.fotoURL != nil {
		fotoLama = s.fotoURL(existing)
	}

	apply(existing)

	if err := s.ensureUnique(ctx, existing, id); err != nil {
		return nil, err
	}
	if err := s.repo.Update(ctx, existing); err != nil {
		return nil, apperror.Internal(err)
	}

	// Foto diganti → bersihkan aset lama dari storage (FR-015)
	if s.fotoURL != nil && fotoLama != "" && fotoLama != s.fotoURL(existing) {
		s.deleteFoto(fotoLama)
	}

	s.reval.Trigger(s.tag)
	return existing, nil
}

func (s *ContentService[T]) Delete(ctx context.Context, id uint) error {
	existing, err := s.ByID(ctx, id)
	if err != nil {
		return err
	}

	affected, err := s.repo.Delete(ctx, id)
	if err != nil {
		return apperror.Internal(err)
	}
	if affected == 0 {
		return apperror.NotFound(s.label)
	}

	if s.fotoURL != nil {
		if foto := s.fotoURL(existing); foto != "" {
			s.deleteFoto(foto)
		}
	}

	s.reval.Trigger(s.tag)
	return nil
}

func (s *ContentService[T]) Stats(ctx context.Context) (int64, *time.Time, error) {
	total, err := s.repo.Count(ctx)
	if err != nil {
		return 0, nil, apperror.Internal(err)
	}
	last, err := s.repo.LastUpdated(ctx)
	if err != nil {
		return 0, nil, apperror.Internal(err)
	}
	return total, last, nil
}

func (s *ContentService[T]) ensureUnique(ctx context.Context, item *T, excludeID uint) error {
	value := s.uniqueValue(item)
	exists, err := s.repo.ExistsByUniqueField(ctx, value, excludeID)
	if err != nil {
		return apperror.Internal(err)
	}
	if exists {
		return apperror.Duplicate(value)
	}
	return nil
}

func (s *ContentService[T]) deleteFoto(url string) {
	if s.storage == nil {
		return
	}
	if err := s.storage.Delete(context.Background(), url); err != nil {
		// Kegagalan pembersihan tidak menggagalkan operasi utama —
		// cukup dicatat untuk ditindaklanjuti
		s.logger.Warn("gagal menghapus foto dari storage", "url", url, "error", err)
	}
}
