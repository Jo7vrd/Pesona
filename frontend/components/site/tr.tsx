"use client";

import { stripMarkdown } from "@/lib/markdown";
import { useLocale } from "@/lib/i18n";

/**
 * Pemilih teks per-bahasa untuk dipakai dari Server Component: server
 * mengirim ketiga varian, klien menampilkan sesuai locale aktif.
 * Varian yang kosong jatuh kembali ke Bahasa Indonesia. `strip` membuang
 * penanda markdown (untuk pratinjau kartu yang dipotong).
 */
export function Tr({
  id,
  en,
  zh,
  strip = false,
}: {
  id: string;
  en?: string;
  zh?: string;
  strip?: boolean;
}) {
  const { locale } = useLocale();
  const text = locale === "en" ? en || id : locale === "zh" ? zh || id : id;
  return <>{strip ? stripMarkdown(text) : text}</>;
}
