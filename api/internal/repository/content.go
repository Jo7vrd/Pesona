package repository

import (
	"context"
	"errors"
	"time"

	"gorm.io/gorm"
)

// ContentRepository menggeneralisasi akses data tiga modul konten
// (makanan, budaya, bahasa_lokal) yang berperilaku identik.
type ContentRepository[T any] interface {
	List(ctx context.Context) ([]T, error)
	Unggulan(ctx context.Context) ([]T, error)
	ByID(ctx context.Context, id uint) (*T, error)
	ExistsByUniqueField(ctx context.Context, value string, excludeID uint) (bool, error)
	Create(ctx context.Context, item *T) error
	Update(ctx context.Context, item *T) error
	Delete(ctx context.Context, id uint) (int64, error)
	Count(ctx context.Context) (int64, error)
	LastUpdated(ctx context.Context) (*time.Time, error)
}

type gormContentRepo[T any] struct {
	db *gorm.DB
	// kolom unik untuk cek duplikat (FR-014): "nama" / "bahasa_indonesia"
	uniqueColumn string
	hasUnggulan  bool
}

func NewContentRepo[T any](db *gorm.DB, uniqueColumn string, hasUnggulan bool) ContentRepository[T] {
	return &gormContentRepo[T]{db: db, uniqueColumn: uniqueColumn, hasUnggulan: hasUnggulan}
}

func (r *gormContentRepo[T]) List(ctx context.Context) ([]T, error) {
	var items []T
	err := r.db.WithContext(ctx).Order("updated_at DESC").Find(&items).Error
	return items, err
}

func (r *gormContentRepo[T]) Unggulan(ctx context.Context) ([]T, error) {
	var items []T
	q := r.db.WithContext(ctx).Order("updated_at DESC")
	if r.hasUnggulan {
		q = q.Where("is_unggulan = true")
	}
	err := q.Find(&items).Error
	return items, err
}

func (r *gormContentRepo[T]) ByID(ctx context.Context, id uint) (*T, error) {
	var item T
	err := r.db.WithContext(ctx).First(&item, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *gormContentRepo[T]) ExistsByUniqueField(ctx context.Context, value string, excludeID uint) (bool, error) {
	var model T
	var count int64
	q := r.db.WithContext(ctx).Model(&model).
		Where("LOWER("+r.uniqueColumn+") = LOWER(?)", value)
	if excludeID > 0 {
		q = q.Where("id <> ?", excludeID)
	}
	err := q.Count(&count).Error
	return count > 0, err
}

func (r *gormContentRepo[T]) Create(ctx context.Context, item *T) error {
	return r.db.WithContext(ctx).Create(item).Error
}

func (r *gormContentRepo[T]) Update(ctx context.Context, item *T) error {
	return r.db.WithContext(ctx).Save(item).Error
}

func (r *gormContentRepo[T]) Delete(ctx context.Context, id uint) (int64, error) {
	var model T
	res := r.db.WithContext(ctx).Delete(&model, id)
	return res.RowsAffected, res.Error
}

func (r *gormContentRepo[T]) Count(ctx context.Context) (int64, error) {
	var model T
	var count int64
	err := r.db.WithContext(ctx).Model(&model).Count(&count).Error
	return count, err
}

func (r *gormContentRepo[T]) LastUpdated(ctx context.Context) (*time.Time, error) {
	var model T
	var last *time.Time
	err := r.db.WithContext(ctx).Model(&model).
		Select("MAX(updated_at)").Scan(&last).Error
	return last, err
}
