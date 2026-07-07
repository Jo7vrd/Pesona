# Jelajah Kei Kecil

Website pariwisata Desa Kei Kecil, Maluku Tenggara — portal informasi kuliner, budaya, terumbu karang, bahasa lokal Kei, dan kedaruratan pesisir.

## Struktur monorepo

| Folder  | Isi                                                       |
| ------- | --------------------------------------------------------- |
| `web/`  | Frontend — Next.js 15, React 19, Tailwind v4, shadcn/ui   |
| `api/`  | Backend — Go + Gin, PostgreSQL, GORM (dibangun di Fase 8) |
| `docs/` | PRD dan dokumen arsitektur                                |

## Menjalankan frontend

```bash
cd web
npm install
npm run dev
```

Buka http://localhost:3000.

## Spesifikasi

Spesifikasi fungsional lengkap ada di `docs/PRD_Website_Pariwisata_Kei_Kecil.pdf`. Business rules (BR-001–006) dan functional requirements (FR-001–015) dari PRD tidak boleh diubah.
