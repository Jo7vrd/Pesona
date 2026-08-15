package service

import (
	"context"
	"log/slog"

	"github.com/desakeikecil/api/internal/apperror"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/repository"
	"github.com/desakeikecil/api/internal/revalidate"
	"github.com/desakeikecil/api/internal/storage"
)

// HeroService mengelola foto carousel hero beranda: menghapus aset dari
// storage saat entri dihapus (FR-015) dan memicu revalidasi cache.
type HeroService struct {
	repo    repository.HeroRepository
	storage storage.ObjectStorage
	reval   *revalidate.Client
	logger  *slog.Logger
}

func NewHero(
	repo repository.HeroRepository,
	store storage.ObjectStorage,
	reval *revalidate.Client,
	logger *slog.Logger,
) *HeroService {
	return &HeroService{repo: repo, storage: store, reval: reval, logger: logger}
}

func (s *HeroService) List(ctx context.Context) ([]entity.HeroImage, error) {
	items, err := s.repo.List(ctx)
	if err != nil {
		return nil, apperror.Internal(err)
	}
	return items, nil
}

func (s *HeroService) Create(ctx context.Context, item *entity.HeroImage) error {
	if err := s.repo.Create(ctx, item); err != nil {
		return apperror.Internal(err)
	}
	s.reval.Trigger("hero")
	return nil
}

func (s *HeroService) Reorder(ctx context.Context, ids []uint) error {
	if err := s.repo.Reorder(ctx, ids); err != nil {
		return apperror.Internal(err)
	}
	s.reval.Trigger("hero")
	return nil
}

func (s *HeroService) Delete(ctx context.Context, id uint) error {
	existing, err := s.repo.ByID(ctx, id)
	if err != nil {
		return apperror.Internal(err)
	}
	if existing == nil {
		return apperror.NotFound("Foto hero")
	}

	affected, err := s.repo.Delete(ctx, id)
	if err != nil {
		return apperror.Internal(err)
	}
	if affected == 0 {
		return apperror.NotFound("Foto hero")
	}

	if s.storage != nil && existing.FotoURL != "" {
		if err := s.storage.Delete(context.Background(), existing.FotoURL); err != nil {
			s.logger.Warn("gagal menghapus foto hero dari storage",
				"url", existing.FotoURL, "error", err)
		}
	}

	s.reval.Trigger("hero")
	return nil
}
