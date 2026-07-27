package repository

import (
	"context"
	"errors"

	"gorm.io/gorm"

	"github.com/desakeikecil/api/internal/entity"
)

// EmergencyRepository mengakses kontak darurat halaman Kedaruratan.
type EmergencyRepository interface {
	List(ctx context.Context) ([]entity.EmergencyContact, error)
	ByID(ctx context.Context, id uint) (*entity.EmergencyContact, error)
	Create(ctx context.Context, e *entity.EmergencyContact) error
	Update(ctx context.Context, e *entity.EmergencyContact) error
	Delete(ctx context.Context, id uint) (int64, error)
}

type gormEmergencyRepo struct{ db *gorm.DB }

func NewEmergencyRepo(db *gorm.DB) EmergencyRepository {
	return &gormEmergencyRepo{db: db}
}

func (r *gormEmergencyRepo) List(ctx context.Context) ([]entity.EmergencyContact, error) {
	var items []entity.EmergencyContact
	err := r.db.WithContext(ctx).Order("urutan ASC, id ASC").Find(&items).Error
	return items, err
}

func (r *gormEmergencyRepo) ByID(ctx context.Context, id uint) (*entity.EmergencyContact, error) {
	var e entity.EmergencyContact
	err := r.db.WithContext(ctx).First(&e, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *gormEmergencyRepo) Create(ctx context.Context, e *entity.EmergencyContact) error {
	return r.db.WithContext(ctx).Create(e).Error
}

func (r *gormEmergencyRepo) Update(ctx context.Context, e *entity.EmergencyContact) error {
	return r.db.WithContext(ctx).Save(e).Error
}

func (r *gormEmergencyRepo) Delete(ctx context.Context, id uint) (int64, error) {
	res := r.db.WithContext(ctx).Delete(&entity.EmergencyContact{}, id)
	return res.RowsAffected, res.Error
}
