package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/desakeikecil/api/internal/config"
	"github.com/desakeikecil/api/internal/database"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/repository"
	"github.com/desakeikecil/api/internal/revalidate"
	"github.com/desakeikecil/api/internal/router"
	"github.com/desakeikecil/api/internal/service"
	"github.com/desakeikecil/api/internal/storage"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	if err := run(logger); err != nil {
		logger.Error("fatal", "error", err)
		os.Exit(1)
	}
}

func run(logger *slog.Logger) error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	if err := database.Migrate(cfg.DatabaseURL, logger); err != nil {
		return err
	}

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		return err
	}

	// ---- Storage: R2 di produksi, disk lokal saat pengembangan ----
	var store storage.ObjectStorage
	if cfg.R2Enabled() {
		store, err = storage.NewR2(context.Background(),
			cfg.R2AccountID, cfg.R2AccessKey, cfg.R2SecretKey,
			cfg.R2Bucket, cfg.R2PublicURL)
		if err != nil {
			return err
		}
		logger.Info("storage: Cloudflare R2", "bucket", cfg.R2Bucket)
	} else {
		base := cfg.PublicAssets
		if base == "" {
			base = fmt.Sprintf("http://localhost:%s/uploads", cfg.Port)
		}
		store, err = storage.NewLocal(cfg.UploadDir, base)
		if err != nil {
			return err
		}
		logger.Warn("storage: disk lokal (R2 belum dikonfigurasi)")
	}

	reval := revalidate.New(cfg.RevalidateURL, cfg.RevalidateKey, logger)

	// ---- Wiring repository → service ----
	makananSvc := service.NewContent(
		repository.NewContentRepo[entity.Makanan](db, "nama", true),
		func(m *entity.Makanan) string { return m.Nama },
		func(m *entity.Makanan) string { return m.FotoURL },
		"Sajian", "makanan", store, reval, logger,
	)
	budayaSvc := service.NewContent(
		repository.NewContentRepo[entity.Budaya](db, "nama", true),
		func(b *entity.Budaya) string { return b.Nama },
		func(b *entity.Budaya) string { return b.FotoURL },
		"Budaya", "budaya", store, reval, logger,
	)
	bahasaSvc := service.NewContent(
		repository.NewContentRepo[entity.BahasaLokal](db, "bahasa_indonesia", false),
		func(b *entity.BahasaLokal) string { return b.BahasaIndonesia },
		nil,
		"Kosakata", "bahasa", store, reval, logger,
	)
	authSvc := service.NewAuth(repository.NewAdminRepo(db), cfg.JWTSecret, cfg.JWTTTL)
	uploadSvc := service.NewUpload(store)

	engine := router.New(router.Deps{
		Config:  cfg,
		Logger:  logger,
		Auth:    authSvc,
		Makanan: makananSvc,
		Budaya:  budayaSvc,
		Bahasa:  bahasaSvc,
		Upload:  uploadSvc,
	})

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           engine,
		ReadHeaderTimeout: 10 * time.Second,
	}

	// Graceful shutdown: selesaikan permintaan berjalan saat SIGTERM
	errCh := make(chan error, 1)
	go func() {
		logger.Info("server berjalan", "port", cfg.Port, "env", cfg.Env)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case err := <-errCh:
		return err
	case sig := <-quit:
		logger.Info("shutdown", "signal", sig.String())
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return srv.Shutdown(ctx)
	}
}
