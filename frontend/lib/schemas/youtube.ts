import { z } from "zod";

/** Hanya tautan tontonan YouTube: watch?v=, youtu.be, shorts, embed. */
export const YOUTUBE_URL_RE =
  /^https?:\/\/((www|m)\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{6,}/;

/**
 * Field video opsional yang dipakai lintas modul (destinasi, makanan,
 * budaya, dan setelan halaman Bahasa Kei). String kosong berarti "tanpa
 * video"; selain itu wajib berupa tautan YouTube.
 */
export const videoYoutubeField = z
  .string()
  .trim()
  .max(500, "Tautan terlalu panjang")
  .refine((v) => v === "" || YOUTUBE_URL_RE.test(v), {
    message:
      "Hanya tautan YouTube yang diterima (youtube.com/watch, youtu.be, atau shorts)",
  });
