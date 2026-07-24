package repository

import (
	"context"
	"errors"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"github.com/desakeikecil/api/internal/entity"
)

// SettingsRepository mengakses tabel key-value settings.
type SettingsRepository interface {
	Get(ctx context.Context, key string) (string, bool, error)
	Set(ctx context.Context, key, value string) error
}

type gormSettingsRepo struct{ db *gorm.DB }

func NewSettingsRepo(db *gorm.DB) SettingsRepository { return &gormSettingsRepo{db: db} }

func (r *gormSettingsRepo) Get(ctx context.Context, key string) (string, bool, error) {
	var s entity.Setting
	err := r.db.WithContext(ctx).First(&s, "key = ?", key).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return "", false, nil
	}
	if err != nil {
		return "", false, err
	}
	return s.Value, true, nil
}

// Set melakukan upsert (INSERT ... ON CONFLICT (key) DO UPDATE).
func (r *gormSettingsRepo) Set(ctx context.Context, key, value string) error {
	s := entity.Setting{Key: key, Value: value, UpdatedAt: time.Now()}
	return r.db.WithContext(ctx).Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "key"}},
		DoUpdates: clause.AssignmentColumns([]string{"value", "updated_at"}),
	}).Create(&s).Error
}
