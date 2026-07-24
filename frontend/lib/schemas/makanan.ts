import { z } from "zod";

import { videoYoutubeField } from "@/lib/schemas/youtube";

export const makananSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  kategori: z.enum(["makanan", "minuman", "kudapan"], {
    error: "Pilih kategori",
  }),
  deskripsi: z
    .string()
    .trim()
    .min(20, "Deskripsi minimal 20 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter"),
  fotoUrl: z.string().min(1, "Foto wajib diisi"),
  isUnggulan: z.boolean(),
  videoYoutube: videoYoutubeField,
});

export type MakananInput = z.infer<typeof makananSchema>;
