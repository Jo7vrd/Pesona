package handler

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/desakeikecil/api/internal/apperror"
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
