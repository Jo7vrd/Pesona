import { z } from "zod";

export const bahasaSchema = z.object({
  bahasaIndonesia: z
    .string()
    .trim()
    .min(1, "Kata bahasa Indonesia wajib diisi")
    .max(100, "Maksimal 100 karakter"),
  bahasaKei: z
    .string()
    .trim()
    .min(1, "Kata bahasa Kei wajib diisi")
    .max(100, "Maksimal 100 karakter"),
  catatan: z.string().trim().max(200, "Catatan maksimal 200 karakter"),
});

export type BahasaInput = z.infer<typeof bahasaSchema>;
