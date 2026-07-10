"use client";

import { useLocale } from "@/lib/i18n";

/**
 * Pita teks berjalan (marquee) dengan gradien brand. Konten duplikat
 * kedua murni dekoratif; animasi berhenti saat prefers-reduced-motion.
 */
export function MarqueeStrip() {
  const { t } = useLocale();

  return (
    <div
      aria-hidden
      className="bg-brand-gradient -rotate-1 scale-[1.02] overflow-hidden py-4 shadow-lg"
    >
      <div className="animate-marquee motion-reduce:animate-none flex w-max">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center">
            {t.marquee.map((word) => (
              <span
                key={`${word}-${dup}`}
                className="flex items-center text-sm font-bold tracking-[0.22em] whitespace-nowrap text-white/95 uppercase"
              >
                <span className="mx-5">{word}</span>
                <span className="text-lagoon-300 text-base">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
