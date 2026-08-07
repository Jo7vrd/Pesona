import { z } from "zod";

/** Daftar sub-bagian (judul + isi) untuk memperkaya deskripsi konten. */
export const subsectionsField = z.array(
  z.object({
    judul: z
      .string()
      .trim()
      .min(1, "Judul wajib diisi")
      .max(120, "Judul maksimal 120 karakter"),
    isi: z
      .string()
      .trim()
      .min(1, "Isi wajib diisi")
      .max(4000, "Isi maksimal 4000 karakter"),
  })
);
