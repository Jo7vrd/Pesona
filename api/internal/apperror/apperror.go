package apperror

import (
	"errors"
	"fmt"
	"net/http"
)

// AppError adalah error ber-status yang dipetakan handler ke respons HTTP
// dengan pesan aman untuk pengguna (PRD §11).
type AppError struct {
	Status  int
	Message string
	Err     error
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

func (e *AppError) Unwrap() error { return e.Err }

func NotFound(resource string) *AppError {
	return &AppError{Status: http.StatusNotFound, Message: resource + " tidak ditemukan."}
}

func Duplicate(nama string) *AppError {
	return &AppError{
		Status:  http.StatusConflict,
		Message: fmt.Sprintf("%q sudah terdaftar. Gunakan nama lain.", nama),
	}
}

func Unauthorized(message string) *AppError {
	if message == "" {
		message = "Sesi berakhir. Silakan masuk kembali."
	}
	return &AppError{Status: http.StatusUnauthorized, Message: message}
}

func Forbidden() *AppError {
	return &AppError{Status: http.StatusForbidden, Message: "Anda tidak memiliki akses untuk aksi ini."}
}

func BadRequest(message string) *AppError {
	return &AppError{Status: http.StatusBadRequest, Message: message}
}

func Internal(err error) *AppError {
	return &AppError{
		Status:  http.StatusInternalServerError,
		Message: "Terjadi kesalahan pada server. Coba lagi.",
		Err:     err,
	}
}

// From mengembalikan *AppError dari err, atau membungkusnya sebagai 500.
func From(err error) *AppError {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr
	}
	return Internal(err)
}
