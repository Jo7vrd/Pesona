DATABASE_URL ?= postgres://$(USER)@localhost:5432/keikecil?sslmode=disable

.PHONY: run seed build test vet migrate-down docker

run: ## Jalankan server pengembangan
	DATABASE_URL="$(DATABASE_URL)" go run ./cmd/api

seed: ## Migrasi + isi data awal (idempoten)
	DATABASE_URL="$(DATABASE_URL)" go run ./cmd/seed

build: ## Build binari produksi
	CGO_ENABLED=0 go build -ldflags="-s -w" -o bin/api ./cmd/api

test:
	go test ./...

vet:
	go vet ./...

docker: ## Build image produksi
	docker build -t keikecil-api .
