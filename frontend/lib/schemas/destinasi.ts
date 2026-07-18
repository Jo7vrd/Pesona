import { z } from "zod";

/** Hanya tautan tontonan YouTube: watch?v=, youtu.be, shorts, embed. */
export const YOUTUBE_URL_RE =
  /^https?:\/\/((www|m)\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{6,}/;

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
  videoYoutube: z
    .string()
    .trim()
    .max(500, "Tautan terlalu panjang")
    .refine((v) => v === "" || YOUTUBE_URL_RE.test(v), {
      message:
        "Hanya tautan YouTube yang diterima (youtube.com/watch, youtu.be, atau shorts)",
    }),
});

export type DestinasiInput = z.infer<typeof destinasiSchema>;
