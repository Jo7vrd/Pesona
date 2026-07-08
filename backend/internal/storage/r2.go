package storage

import (
	"context"
	"fmt"
	"io"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// R2Storage menyimpan objek ke Cloudflare R2 lewat API kompatibel S3.
type R2Storage struct {
	client    *s3.Client
	bucket    string
	publicURL string // domain publik bucket (custom domain / r2.dev)
}

func NewR2(ctx context.Context, accountID, accessKey, secretKey, bucket, publicURL string) (*R2Storage, error) {
	cfg, err := awsconfig.LoadDefaultConfig(ctx,
		awsconfig.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(accessKey, secretKey, ""),
		),
		awsconfig.WithRegion("auto"),
	)
	if err != nil {
		return nil, fmt.Errorf("konfigurasi R2: %w", err)
	}

	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(
			fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountID),
		)
	})

	return &R2Storage{
		client:    client,
		bucket:    bucket,
		publicURL: strings.TrimRight(publicURL, "/"),
	}, nil
}

func (s *R2Storage) Put(ctx context.Context, key, contentType string, body io.Reader) (string, error) {
	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(key),
		Body:        body,
		ContentType: aws.String(contentType),
	})
	if err != nil {
		return "", fmt.Errorf("unggah ke R2: %w", err)
	}
	return s.publicURL + "/" + key, nil
}

func (s *R2Storage) Delete(ctx context.Context, publicURL string) error {
	key, ok := strings.CutPrefix(publicURL, s.publicURL+"/")
	if !ok {
		return nil // bukan aset kelolaan kita
	}
	_, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
	})
	if err != nil {
		return fmt.Errorf("hapus objek R2: %w", err)
	}
	return nil
}
