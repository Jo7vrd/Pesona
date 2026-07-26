package repository

import (
	"context"
	"errors"

	"gorm.io/gorm"

	"github.com/desakeikecil/api/internal/entity"
)

// HeroRepository mengakses foto carousel hero beranda.
type HeroRepository interface {
	List(ctx context.Context) ([]entity.HeroImage, error)
	ByID(ctx context.Context, id uint) (*entity.HeroImage, error)
	Create(ctx context.Context, h *entity.HeroImage) error
	Delete(ctx context.Context, id uint) (int64, error)
}

type gormHeroRepo struct{ db *gorm.DB }

func NewHeroRepo(db *gorm.DB) HeroRepository { return &gormHeroRepo{db: db} }

func (r *gormHeroRepo) List(ctx context.Context) ([]entity.HeroImage, error) {
	var items []entity.HeroImage
	err := r.db.WithContext(ctx).Order("urutan ASC, id ASC").Find(&items).Error
	return items, err
}

func (r *gormHeroRepo) ByID(ctx context.Context, id uint) (*entity.HeroImage, error) {
	var h entity.HeroImage
	err := r.db.WithContext(ctx).First(&h, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &h, nil
}

func (r *gormHeroRepo) Create(ctx context.Context, h *entity.HeroImage) error {
	return r.db.WithContext(ctx).Create(h).Error
}

func (r *gormHeroRepo) Delete(ctx context.Context, id uint) (int64, error) {
	res := r.db.WithContext(ctx).Delete(&entity.HeroImage{}, id)
	return res.RowsAffected, res.Error
}
