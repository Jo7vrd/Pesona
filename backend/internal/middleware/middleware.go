package middleware

import (
	"log/slog"
	"net/http"
	"slices"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/time/rate"

	"github.com/desakeikecil/api/internal/apperror"
	"github.com/desakeikecil/api/internal/service"
)

const (
	CtxClaims    = "claims"
	headerReqID  = "X-Request-ID"
	bearerPrefix = "Bearer "
)

// RequestID menyematkan ID unik untuk korelasi log per permintaan.
func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetHeader(headerReqID)
		if id == "" {
			id = uuid.NewString()
		}
		c.Set("request_id", id)
		c.Header(headerReqID, id)
		c.Next()
	}
}

// Logger mencatat setiap permintaan terstruktur via slog.
func Logger(logger *slog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		logger.Info("http",
			"request_id", c.GetString("request_id"),
			"method", c.Request.Method,
			"path", c.Request.URL.Path,
			"status", c.Writer.Status(),
			"duration_ms", time.Since(start).Milliseconds(),
			"ip", c.ClientIP(),
		)
	}
}

// Recover mengubah panic menjadi respons 500 yang aman.
func Recover(logger *slog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				logger.Error("panic", "request_id", c.GetString("request_id"), "panic", r)
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"message": "Terjadi kesalahan pada server. Coba lagi.",
				})
			}
		}()
		c.Next()
	}
}

// CORS mengizinkan origin frontend dengan kredensial (cookie).
func CORS(origins []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" && slices.Contains(origins, origin) {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Allow-Credentials", "true")
			c.Header("Vary", "Origin")
		}
		if c.Request.Method == http.MethodOptions {
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-ID")
			c.Header("Access-Control-Max-Age", "86400")
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

// Auth memvalidasi JWT dari cookie httpOnly (BR-001) atau header Bearer.
func Auth(auth *service.AuthService, cookieName string) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := ""
		if cookie, err := c.Cookie(cookieName); err == nil {
			token = cookie
		} else if h := c.GetHeader("Authorization"); strings.HasPrefix(h, bearerPrefix) {
			token = strings.TrimPrefix(h, bearerPrefix)
		}
		if token == "" {
			abort(c, apperror.Unauthorized(""))
			return
		}
		claims, err := auth.Verify(token)
		if err != nil {
			abort(c, apperror.From(err))
			return
		}
		c.Set(CtxClaims, claims)
		c.Next()
	}
}

// RequireRole membatasi akses berdasarkan peran (RBAC).
func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, ok := c.Get(CtxClaims)
		if !ok {
			abort(c, apperror.Unauthorized(""))
			return
		}
		role := claims.(*service.Claims).Role
		if !slices.Contains(roles, role) {
			abort(c, apperror.Forbidden())
			return
		}
		c.Next()
	}
}

// LoginRateLimit membatasi percobaan login per IP (anti brute force):
// 5 percobaan per menit dengan burst 5.
func LoginRateLimit() gin.HandlerFunc {
	type visitor struct {
		limiter *rate.Limiter
		seen    time.Time
	}
	var (
		mu       sync.Mutex
		visitors = map[string]*visitor{}
	)

	// pembersihan berkala agar peta tidak tumbuh tanpa batas
	go func() {
		for range time.Tick(10 * time.Minute) {
			mu.Lock()
			for ip, v := range visitors {
				if time.Since(v.seen) > 15*time.Minute {
					delete(visitors, ip)
				}
			}
			mu.Unlock()
		}
	}()

	return func(c *gin.Context) {
		ip := c.ClientIP()
		mu.Lock()
		v, ok := visitors[ip]
		if !ok {
			v = &visitor{limiter: rate.NewLimiter(rate.Every(12*time.Second), 5)}
			visitors[ip] = v
		}
		v.seen = time.Now()
		allowed := v.limiter.Allow()
		mu.Unlock()

		if !allowed {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"message": "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.",
			})
			return
		}
		c.Next()
	}
}

func abort(c *gin.Context, err *apperror.AppError) {
	c.AbortWithStatusJSON(err.Status, gin.H{"message": err.Message})
}
