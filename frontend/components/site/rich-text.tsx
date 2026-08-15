"use client";

import { renderMarkdown } from "@/lib/markdown";
import { useLocale } from "@/lib/i18n";

/**
 * Render teks ber-markdown (aman) untuk bahasa aktif. Server mengirim
 * ketiga varian; varian kosong jatuh ke Bahasa Indonesia. Dipakai untuk
 * deskripsi & isi sub-bagian yang bisa diberi format (tebal/miring/dll).
 * Merender sebagai <div> berisi <p>/<ul>, jadi JANGAN dibungkus <p>.
 */
export function RichTr({
  id,
  en,
  zh,
  className = "",
}: {
  id: string;
  en?: string;
  zh?: string;
  className?: string;
}) {
  const { locale } = useLocale();
  const text = locale === "en" ? en || id : locale === "zh" ? zh || id : id;
  return (
    <div
      className={`space-y-3 ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
    />
  );
}

/** Varian tanpa terjemahan: render satu string ber-markdown. */
export function RichText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`space-y-3 ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
    />
  );
}
