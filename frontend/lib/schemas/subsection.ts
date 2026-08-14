import { z } from "zod";

/**
 * Daftar sub-bagian untuk memperkaya deskripsi konten. Tiap blok bisa
 * berisi judul, teks, dan/atau foto sisipan (dengan pembingkaian sendiri).
 * Judul & isi boleh kosong bila blok hanya berupa foto.
 */
export const subsectionsField = z.array(
  z.object({
    judul: z.string().trim().max(120, "Judul maksimal 120 karakter"),
    isi: z.string().trim().max(4000, "Isi maksimal 4000 karakter"),
    foto: z.string().max(500).optional(),
    fotoPosisi: z.string().max(20).optional(),
    fotoZoom: z.number().min(1).max(3).optional(),
  })
);
