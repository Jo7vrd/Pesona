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

// PetaKarangFoto mengembalikan URL foto peta karang halaman Peta; string
// kosong berarti belum diset.
func (s *SettingsService) PetaKarangFoto(ctx context.Context) (string, error) {
	v, _, err := s.repo.Get(ctx, entity.SettingPetaKarangFoto)
	if err != nil {
		return "", apperror.Internal(err)
	}
	return v, nil
}

func (s *SettingsService) SetPetaKarangFoto(ctx context.Context, url string) error {
	if err := s.repo.Set(ctx, entity.SettingPetaKarangFoto, url); err != nil {
		return apperror.Internal(err)
	}
	s.reval.Trigger("settings")
	// Halaman Peta juga di-revalidasi via tag khusus bila ada
	s.reval.Trigger("peta")
	return nil
}

// PageHeroes mengembalikan peta slug-halaman → URL foto hero untuk
// halaman yang sudah disetel (yang kosong dilewati).
func (s *SettingsService) PageHeroes(ctx context.Context) (map[string]string, error) {
	out := make(map[string]string)
	for _, page := range entity.PageHeroPages {
		v, _, err := s.repo.Get(ctx, entity.PageHeroKey(page))
		if err != nil {
			return nil, apperror.Internal(err)
		}
		if v != "" {
			out[page] = v
		}
	}
	return out, nil
}

func (s *SettingsService) SetPageHero(ctx context.Context, page, url string) error {
	if !entity.IsPageHeroPage(page) {
		return apperror.BadRequest("Halaman hero tidak dikenal.")
	}
	if err := s.repo.Set(ctx, entity.PageHeroKey(page), url); err != nil {
		return apperror.Internal(err)
	}
	s.reval.Trigger("settings")
	return nil
}
