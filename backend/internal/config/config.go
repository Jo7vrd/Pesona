package config

import (
	"fmt"
	"os"
	"strings"
	"time"
)

// Config memuat seluruh konfigurasi aplikasi dari environment variable.
// Tidak ada nilai rahasia yang di-hardcode; lihat .env.example.
type Config struct {
	Env           string
	Port          string
	DatabaseURL   string
	JWTSecret     string
	JWTTTL        time.Duration
	CORSOrigins   []string
	CookieName    string
	CookieSecure  bool
	RevalidateURL string
	RevalidateKey string

	// Cloudflare R2 (kompatibel S3). Kosong = simpan ke disk lokal (dev).
	R2AccountID  string
	R2AccessKey  string
	R2SecretKey  string
	R2Bucket     string
	R2PublicURL  string
	UploadDir    string
	PublicAssets string
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func Load() (*Config, error) {
	cfg := &Config{
		Env:         getenv("APP_ENV", "development"),
		Port:        getenv("PORT", "8080"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
		JWTSecret:   os.Getenv("JWT_SECRET"),
		// Sesi admin 8 jam (PRD §7.1)
		JWTTTL:        8 * time.Hour,
		CookieName:    getenv("SESSION_COOKIE", "kk_admin_session"),
		RevalidateURL: os.Getenv("REVALIDATE_URL"),
		RevalidateKey: os.Getenv("REVALIDATE_SECRET"),
		R2AccountID:   os.Getenv("R2_ACCOUNT_ID"),
		R2AccessKey:   os.Getenv("R2_ACCESS_KEY_ID"),
		R2SecretKey:   os.Getenv("R2_SECRET_ACCESS_KEY"),
		R2Bucket:      os.Getenv("R2_BUCKET"),
		R2PublicURL:   strings.TrimRight(os.Getenv("R2_PUBLIC_URL"), "/"),
		UploadDir:     getenv("UPLOAD_DIR", "uploads"),
		PublicAssets:  getenv("PUBLIC_ASSET_URL", ""),
	}

	for _, origin := range strings.Split(getenv("CORS_ORIGINS", "http://localhost:3000"), ",") {
		if o := strings.TrimSpace(origin); o != "" {
			cfg.CORSOrigins = append(cfg.CORSOrigins, o)
		}
	}

	cfg.CookieSecure = cfg.Env == "production"

	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL wajib di-set")
	}
	if cfg.JWTSecret == "" {
		if cfg.Env == "production" {
			return nil, fmt.Errorf("JWT_SECRET wajib di-set di production")
		}
		cfg.JWTSecret = "dev-only-secret-ganti-di-production"
	}

	return cfg, nil
}

func (c *Config) R2Enabled() bool {
	return c.R2AccountID != "" && c.R2AccessKey != "" && c.R2SecretKey != "" && c.R2Bucket != ""
}
