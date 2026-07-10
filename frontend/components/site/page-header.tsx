"use client";

import Image from "next/image";

import { BLUR_DATA_URL } from "@/lib/blur";
import { useLocale } from "@/lib/i18n";
import { FadeIn } from "@/components/motion/fade-in";

export function PageHeader({
  pageKey,
  eyebrow,
  title,
  description,
  imageUrl,
}: {
  /** Kunci kamus i18n (t.pages[pageKey]); menimpa teks props bila ada. */
  pageKey?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Foto latar opsional, di-overlay gradien gelap agar teks tetap AA. */
  imageUrl?: string;
}) {
  const { t } = useLocale();
  const copy = pageKey ? t.pages[pageKey] : undefined;
  const teksEyebrow = copy?.eyebrow ?? eyebrow;
  const teksTitle = copy?.title ?? title;
  const teksDesc = copy?.desc ?? description;

  return (
    <header className="bg-ocean-950 relative overflow-hidden text-white">
      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
          <div className="from-ocean-950/95 via-ocean-950/70 to-ocean-950/30 absolute inset-0 bg-gradient-to-br" />
        </>
      ) : null}
      <div className="container-page relative pt-32 pb-14 md:pt-36 md:pb-16">
        <FadeIn>
          <p className="eyebrow text-lagoon-300 mb-4">{teksEyebrow}</p>
          <h1 className="font-display text-display-lg max-w-3xl font-bold text-balance">
            {teksTitle}
          </h1>
          {teksDesc ? (
            <p className="text-lede mt-5 max-w-2xl text-white/80">
              {teksDesc}
            </p>
          ) : null}
        </FadeIn>
      </div>
    </header>
  );
}
