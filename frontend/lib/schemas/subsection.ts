import { z } from "zod";

import type { Subsection } from "@/lib/types";

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

/**
 * Bersihkan sub-bagian dari backend sebelum masuk form: backend bisa
 * mengirim fotoZoom 0 untuk blok teks (tanpa foto), yang menabrak validasi
 * min(1). Nilai di luar [1,3] dianggap "tak ada zoom" (undefined).
 */
export function normalizeSubsections(subs?: Subsection[] | null): Subsection[] {
  return (subs ?? []).map((s) => ({
    ...s,
    fotoZoom:
      typeof s.fotoZoom === "number" && s.fotoZoom >= 1 && s.fotoZoom <= 3
        ? s.fotoZoom
        : undefined,
  }));
}
