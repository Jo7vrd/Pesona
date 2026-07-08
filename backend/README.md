# API — Jelajah Kei Kecil

Backend Go untuk situs pariwisata Kei Kecil. Gin + GORM + PostgreSQL,
JWT httpOnly (sesi 8 jam), RBAC, foto di Cloudflare R2 (disk lokal saat
pengembangan), migrasi SQL ter-embed, dan webhook revalidasi cache ke
frontend Next.js.

## Arsitektur

```
cmd/api          → composition root + graceful shutdown
cmd/seed         → migrasi + data awal (idempoten)
internal/
  config         → konfigurasi via env
  entity         → model GORM (PRD §8.3)
  dto            → request/response + validasi binding
  repository     → akses data (interface + GORM, generic)
  service        → aturan bisnis: duplikat FR-014, kaskade foto FR-015,
                   auth bcrypt+JWT, proses gambar §8.4
  handler        → binding → service → respons {data}/{message}
  middleware     → request-id, logger slog, recover, CORS, auth, RBAC,
                   rate limit login
  storage        → ObjectStorage: R2 (produksi) / disk lokal (dev)
  revalidate     → webhook cache tag → Next.js
  database       → koneksi + migrasi embed
```

## Menjalankan lokal

```bash
createdb keikecil
make seed   # migrasi + admin pertama + konten awal
make run    # server di :8080
```

Kredensial awal: `admin@keikecil.id` / `KeiKecil#2026` (ubah lewat env
`SEED_ADMIN_*`; lihat `.env.example` untuk semua variabel).

## Endpoint utama

| Rute | Akses |
| --- | --- |
| `GET /api/v1/{makanan,budaya}[/unggulan,/:id]`, `GET /api/v1/bahasa` | publik |
| `POST /api/v1/auth/login` (rate limit 5/menit/IP), `/logout`, `GET /me` | publik/JWT |
| `GET /api/v1/admin/stats`, `POST /api/v1/admin/upload` | JWT + RBAC |
| CRUD `/api/v1/admin/{makanan,budaya,bahasa}` | JWT + RBAC |

Kontrak respons: sukses `{"data": …}`, gagal `{"message": …}` — cocok
dengan `frontend/lib/api/admin.ts`.

## Catatan implementasi

- Upload: MIME disniff dari isi file (bukan ekstensi), maks 5MB, sisi
  terpanjang disusutkan ke 800px. Keluaran JPEG q85 — PRD §8.4 menyebut
  WebP, namun encoder WebP murni-Go belum tersedia; anggaran dimensi dan
  bobot tetap terpenuhi.
- Hapus/ganti foto ikut membersihkan objek storage (FR-015), best-effort.
- Konten seed (termasuk kosakata Kei) wajib divalidasi perangkat desa
  dan penutur asli sebelum produksi.
