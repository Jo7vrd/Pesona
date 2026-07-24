package service

import (
	"context"

	"github.com/desakeikecil/api/internal/apperror"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/repository"
	"github.com/desakeikecil/api/internal/revalidate"
)

// SettingsService mengelola setelan tingkat-situs dan memicu revalidasi
// cache frontend saat berubah.
type SettingsService struct {
	repo  repository.SettingsRepository
	reval *revalidate.Client
}

func NewSettings(repo repository.SettingsRepository, reval *revalidate.Client) *SettingsService {
	return &SettingsService{repo: repo, reval: reval}
}

// BahasaVideo mengembalikan tautan video halaman Bahasa Kei; string
// kosong berarti belum diset.
func (s *SettingsService) BahasaVideo(ctx context.Context) (string, error) {
	v, _, err := s.repo.Get(ctx, entity.SettingBahasaVideo)
	if err != nil {
		return "", apperror.Internal(err)
	}
	return v, nil
}

func (s *SettingsService) SetBahasaVideo(ctx context.Context, url string) error {
	if err := s.repo.Set(ctx, entity.SettingBahasaVideo, url); err != nil {
		return apperror.Internal(err)
	}
	s.reval.Trigger("settings")
	return nil
}
