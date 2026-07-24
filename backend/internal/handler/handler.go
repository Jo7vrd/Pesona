package handler

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/desakeikecil/api/internal/apperror"
	"github.com/desakeikecil/api/internal/dto"
)

// helpers respons seragam: sukses {data}, gagal {message} (kontrak frontend)

func respondData(c *gin.Context, status int, data any) {
	c.JSON(status, gin.H{"data": data})
}

func respondError(c *gin.Context, logger *slog.Logger, err error) {
	appErr := apperror.From(err)
	if appErr.Status >= 500 {
		logger.Error("internal error",
			"request_id", c.GetString("request_id"),
			"path", c.Request.URL.Path,
			"error", appErr.Err,
		)
	}
	c.JSON(appErr.Status, gin.H{"message": appErr.Message})
}

func respondInvalid(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"message": "Data tidak valid. Periksa kembali isian Anda.",
	})
}

func paramID(c *gin.Context) (uint, bool) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil || id == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "ID tidak valid."})
		return 0, false
	}
	return uint(id), true
}

// normalizeVideo memvalidasi field video opsional lintas modul: string
// kosong dinormalkan menjadi NULL, selain itu wajib tautan YouTube.
// Mengembalikan false (dan menulis respons 400) bila tautan tidak sah.
func normalizeVideo(c *gin.Context, video **string) bool {
	if *video == nil {
		return true
	}
	if **video == "" {
		*video = nil
		return true
	}
	if !dto.ValidYouTubeURL(**video) {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Tautan video harus berupa link YouTube (youtube.com atau youtu.be).",
		})
		return false
	}
	return true
}
