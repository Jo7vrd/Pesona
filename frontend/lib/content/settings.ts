import type { SiteSettings } from "@/lib/types";

/**
 * Setelan situs bawaan (BR-002). Dipakai sebagai seed adapter mock dan
 * fallback RSC saat backend belum menyetel nilainya. Video Bahasa Kei
 * bawaan adalah contoh yang bisa diganti operator desa lewat admin.
 */
export const defaultSettings: SiteSettings = {
  bahasaVideo: "https://www.youtube.com/watch?v=k81PbidCf74",
};
