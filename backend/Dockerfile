# Build multi-tahap: binari statis di atas image distroless (~20MB)
FROM golang:1.26-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /out/api ./cmd/api

# Root (uid 0) agar bisa menulis ke Railway Volume yang di-mount di /data.
# Volume Railway dimiliki root; image non-root gagal mkdir /data/uploads.
FROM gcr.io/distroless/static-debian12
COPY --from=build /out/api /api
EXPOSE 8080
ENTRYPOINT ["/api"]
