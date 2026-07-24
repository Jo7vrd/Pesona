import { z } from "zod";

import { videoYoutubeField } from "@/lib/schemas/youtube";

export const destinasiSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  jenis: z.enum(["Pantai", "Snorkeling", "Gua", "Pulau"], {
    error: "Pilih jenis destinasi",
  }),
  deskripsi: z
    .string()
    .trim()
    .min(20, "Deskripsi minimal 20 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter"),
  lat: z
    .number({ error: "Isi angka, contoh -5.66" })
    .min(-90, "Latitude antara -90 dan 90")
    .max(90, "Latitude antara -90 dan 90"),
  lng: z
    .number({ error: "Isi angka, contoh 132.641" })
    .min(-180, "Longitude antara -180 dan 180")
    .max(180, "Longitude antara -180 dan 180"),
  fotoUrl: z.string().min(1, "Foto wajib diisi"),
  videoYoutube: videoYoutubeField,
});

export type DestinasiInput = z.infer<typeof destinasiSchema>;
