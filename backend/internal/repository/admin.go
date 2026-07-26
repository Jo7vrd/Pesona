package repository

import (
	"context"
	"errors"

	"gorm.io/gorm"

	"github.com/desakeikecil/api/internal/entity"
)

type AdminRepository interface {
	ByUsername(ctx context.Context, username string) (*entity.Admin, error)
	ByID(ctx context.Context, id uint) (*entity.Admin, error)
	List(ctx context.Context) ([]entity.Admin, error)
	Create(ctx context.Context, a *entity.Admin) error
	Update(ctx context.Context, a *entity.Admin) error
	Delete(ctx context.Context, id uint) (int64, error)
	ExistsByUsername(ctx context.Context, username string, excludeID uint) (bool, error)
	CountActiveSuperAdmins(ctx context.Context, excludeID uint) (int64, error)
}

type gormAdminRepo struct{ db *gorm.DB }

func NewAdminRepo(db *gorm.DB) AdminRepository {
	return &gormAdminRepo{db: db}
}

func (r *gormAdminRepo) ByUsername(ctx context.Context, username string) (*entity.Admin, error) {
	var admin entity.Admin
	err := r.db.WithContext(ctx).Where("LOWER(username) = LOWER(?)", username).First(&admin).Error
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

func (r *gormAdminRepo) List(ctx context.Context) ([]entity.Admin, error) {
	var admins []entity.Admin
	err := r.db.WithContext(ctx).Order("created_at ASC, id ASC").Find(&admins).Error
	return admins, err
}

func (r *gormAdminRepo) Create(ctx context.Context, a *entity.Admin) error {
	return r.db.WithContext(ctx).Create(a).Error
}

func (r *gormAdminRepo) Update(ctx context.Context, a *entity.Admin) error {
	return r.db.WithContext(ctx).Save(a).Error
}

func (r *gormAdminRepo) Delete(ctx context.Context, id uint) (int64, error) {
	res := r.db.WithContext(ctx).Delete(&entity.Admin{}, id)
	return res.RowsAffected, res.Error
}

func (r *gormAdminRepo) ExistsByUsername(ctx context.Context, username string, excludeID uint) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&entity.Admin{}).
		Where("LOWER(username) = LOWER(?) AND id <> ?", username, excludeID).
		Count(&count).Error
	return count > 0, err
}

func (r *gormAdminRepo) CountActiveSuperAdmins(ctx context.Context, excludeID uint) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&entity.Admin{}).
		Where("role = ? AND is_active = TRUE AND id <> ?", entity.RoleSuperAdmin, excludeID).
		Count(&count).Error
	return count, err
}
