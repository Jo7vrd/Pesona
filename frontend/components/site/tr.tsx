"use client";

import { useLocale } from "@/lib/i18n";

/**
 * Pemilih teks per-bahasa untuk dipakai dari Server Component: server
 * mengirim ketiga varian, klien menampilkan sesuai locale aktif.
 * Varian yang kosong jatuh kembali ke Bahasa Indonesia.
 */
export function Tr({ id, en, zh }: { id: string; en?: string; zh?: string }) {
  const { locale } = useLocale();
  if (locale === "en") return <>{en || id}</>;
  if (locale === "zh") return <>{zh || id}</>;
  return <>{id}</>;
}
