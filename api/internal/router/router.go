package router

import (
	"log/slog"

	"github.com/gin-gonic/gin"

	"github.com/desakeikecil/api/internal/config"
	"github.com/desakeikecil/api/internal/entity"
	"github.com/desakeikecil/api/internal/handler"
	"github.com/desakeikecil/api/internal/middleware"
	"github.com/desakeikecil/api/internal/service"
)

type Deps struct {
	Config  *config.Config
	Logger  *slog.Logger
	Auth    *service.AuthService
	Makanan *service.ContentService[entity.Makanan]
	Budaya  *service.ContentService[entity.Budaya]
	Bahasa  *service.ContentService[entity.BahasaLokal]
	Upload  *service.UploadService
}

func New(d Deps) *gin.Engine {
	if d.Config.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(
		middleware.RequestID(),
		middleware.Logger(d.Logger),
		middleware.Recover(d.Logger),
		middleware.CORS(d.Config.CORSOrigins),
	)

	authH := handler.NewAuth(d.Auth, d.Config.CookieName, d.Config.CookieSecure, d.Logger)
	makananH := handler.NewMakanan(d.Makanan, d.Logger)
	budayaH := handler.NewBudaya(d.Budaya, d.Logger)
	bahasaH := handler.NewBahasa(d.Bahasa, d.Logger)
	statsH := handler.NewStats(d.Makanan, d.Budaya, d.Bahasa, d.Logger)
	uploadH := handler.NewUploadHandler(d.Upload, d.Logger)

	r.GET("/healthz", handler.Health)

	// Aset lokal saat R2 belum dikonfigurasi (pengembangan)
	if !d.Config.R2Enabled() {
		r.Static("/uploads", d.Config.UploadDir)
	}

	v1 := r.Group("/api/v1")

	// ---- Publik (konsumsi RSC frontend) ----
	v1.GET("/makanan", makananH.List)
	v1.GET("/makanan/unggulan", makananH.Unggulan)
	v1.GET("/makanan/:id", makananH.ByID)
	v1.GET("/budaya", budayaH.List)
	v1.GET("/budaya/unggulan", budayaH.Unggulan)
	v1.GET("/budaya/:id", budayaH.ByID)
	v1.GET("/bahasa", bahasaH.List)

	// ---- Autentikasi ----
	auth := v1.Group("/auth")
	auth.POST("/login", middleware.LoginRateLimit(), authH.Login)
	auth.POST("/logout", authH.Logout)
	auth.GET("/me", middleware.Auth(d.Auth, d.Config.CookieName), authH.Me)

	// ---- Admin (JWT + RBAC) ----
	admin := v1.Group("/admin")
	admin.Use(
		middleware.Auth(d.Auth, d.Config.CookieName),
		middleware.RequireRole(entity.RoleAdmin, entity.RoleSuperAdmin),
	)

	admin.GET("/stats", statsH.Dashboard)
	admin.POST("/upload", uploadH.Upload)

	admin.GET("/makanan", makananH.List)
	admin.POST("/makanan", makananH.Create)
	admin.PUT("/makanan/:id", makananH.Update)
	admin.DELETE("/makanan/:id", makananH.Delete)

	admin.GET("/budaya", budayaH.List)
	admin.POST("/budaya", budayaH.Create)
	admin.PUT("/budaya/:id", budayaH.Update)
	admin.DELETE("/budaya/:id", budayaH.Delete)

	admin.GET("/bahasa", bahasaH.List)
	admin.POST("/bahasa", bahasaH.Create)
	admin.PUT("/bahasa/:id", bahasaH.Update)
	admin.DELETE("/bahasa/:id", bahasaH.Delete)

	return r
}
