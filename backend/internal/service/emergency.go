package service

import (
	"context"

	"github.com/desakeikecil/api/internal/apperror"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/repository"
	"github.com/desakeikecil/api/internal/revalidate"
)

// EmergencyService mengelola kontak darurat dan memicu revalidasi cache
// halaman Kedaruratan saat berubah.
type EmergencyService struct {
	repo  repository.EmergencyRepository
	reval *revalidate.Client
}

func NewEmergency(repo repository.EmergencyRepository, reval *revalidate.Client) *EmergencyService {
	return &EmergencyService{repo: repo, reval: reval}
}

func (s *EmergencyService) List(ctx context.Context) ([]entity.EmergencyContact, error) {
	items, err := s.repo.List(ctx)
	if err != nil {
		return nil, apperror.Internal(err)
	}
	return items, nil
}

func (s *EmergencyService) Create(ctx context.Context, item *entity.EmergencyContact) error {
	if item.Ikon == "" {
		item.Ikon = "phone"
	}
	if err := s.repo.Create(ctx, item); err != nil {
		return apperror.Internal(err)
	}
	s.reval.Trigger("kedaruratan")
	return nil
}

func (s *EmergencyService) Update(ctx context.Context, id uint, apply func(*entity.EmergencyContact)) (*entity.EmergencyContact, error) {
	existing, err := s.repo.ByID(ctx, id)
	if err != nil {
		return nil, apperror.Internal(err)
	}
	if existing == nil {
		return nil, apperror.NotFound("Kontak darurat")
	}
	apply(existing)
	if existing.Ikon == "" {
		existing.Ikon = "phone"
	}
	if err := s.repo.Update(ctx, existing); err != nil {
		return nil, apperror.Internal(err)
	}
	s.reval.Trigger("kedaruratan")
	return existing, nil
}

func (s *EmergencyService) Delete(ctx context.Context, id uint) error {
	affected, err := s.repo.Delete(ctx, id)
	if err != nil {
		return apperror.Internal(err)
	}
	if affected == 0 {
		return apperror.NotFound("Kontak darurat")
	}
	s.reval.Trigger("kedaruratan")
	return nil
}
