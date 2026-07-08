package repository

import (
	"context"
	"errors"

	"gorm.io/gorm"

	"github.com/desakeikecil/api/internal/entity"
)

type AdminRepository interface {
	ByEmail(ctx context.Context, email string) (*entity.Admin, error)
	ByID(ctx context.Context, id uint) (*entity.Admin, error)
}

type gormAdminRepo struct{ db *gorm.DB }

func NewAdminRepo(db *gorm.DB) AdminRepository {
	return &gormAdminRepo{db: db}
}

func (r *gormAdminRepo) ByEmail(ctx context.Context, email string) (*entity.Admin, error) {
	var admin entity.Admin
	err := r.db.WithContext(ctx).Where("LOWER(email) = LOWER(?)", email).First(&admin).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &admin, nil
}

func (r *gormAdminRepo) ByID(ctx context.Context, id uint) (*entity.Admin, error) {
	var admin entity.Admin
	err := r.db.WithContext(ctx).First(&admin, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &admin, nil
}
