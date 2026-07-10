"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { siteConfig } from "@/lib/content/site";
import { useLocale } from "@/lib/i18n";

/** Blok teks landing yang mengikuti bahasa terpilih. */

export function WelcomeCopy() {
  const { t } = useLocale();
  return (
    <>
      <p className="eyebrow mb-4">{t.landing.welcomeEyebrow}</p>
      <h2
        id="sambutan-judul"
        className="font-display text-display-lg text-shadow-soft font-semibold text-balance"
      >
        {t.landing.welcomeTitle}
      </h2>
      <p className="text-muted-foreground mt-6 leading-relaxed">
        {t.landing.welcomeBody}
      </p>
      <p className="mt-4 text-sm font-medium">
        {siteConfig.desa.nama} · {siteConfig.desa.kabupaten}
      </p>
    </>
  );
}

export function KulinerHeading() {
  const { t } = useLocale();
  return (
    <>
      <div>
        <p className="eyebrow mb-4">{t.landing.kulinerEyebrow}</p>
        <h2
          id="kuliner-judul"
          className="font-display text-display-lg text-shadow-soft font-semibold text-balance"
        >
          {t.landing.kulinerTitle}
        </h2>
      </div>
      <Link
        href="/makanan"
        className="text-lagoon-700 hover:text-lagoon-600 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
      >
        {t.landing.lihatSemua}
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </>
  );
}

export function BudayaHeading() {
  const { t } = useLocale();
  return (
    <>
      <p className="eyebrow mb-4">{t.landing.budayaEyebrow}</p>
      <h2
        id="budaya-judul"
        className="font-display text-display-lg text-shadow-soft max-w-2xl font-semibold text-balance"
      >
        {t.landing.budayaTitle}
      </h2>
    </>
  );
}
