package revalidate

import (
	"bytes"
	"context"
	"encoding/json"
	"log/slog"
	"net/http"
	"time"
)

// Client memberi tahu frontend Next.js agar merevalidasi cache tag
// setelah konten berubah, sehingga situs publik segar tanpa menunggu ISR.
// Bersifat best-effort: kegagalan hanya dicatat, tidak menggagalkan CRUD.
type Client struct {
	url    string
	secret string
	http   *http.Client
	logger *slog.Logger
}

func New(url, secret string, logger *slog.Logger) *Client {
	if url == "" {
		return nil
	}
	return &Client{
		url:    url,
		secret: secret,
		http:   &http.Client{Timeout: 5 * time.Second},
		logger: logger,
	}
}

func (c *Client) Trigger(tag string) {
	if c == nil {
		return
	}
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		payload, _ := json.Marshal(map[string]string{"tag": tag})
		req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.url, bytes.NewReader(payload))
		if err != nil {
			c.logger.Warn("revalidate: gagal membuat request", "error", err)
			return
		}
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("X-Revalidate-Secret", c.secret)

		res, err := c.http.Do(req)
		if err != nil {
			c.logger.Warn("revalidate: gagal terhubung", "tag", tag, "error", err)
			return
		}
		defer res.Body.Close()
		if res.StatusCode >= 400 {
			c.logger.Warn("revalidate: ditolak", "tag", tag, "status", res.StatusCode)
		}
	}()
}
