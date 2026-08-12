"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BLUR_DATA_URL } from "@/lib/blur";
import { useCopy } from "@/lib/beranda-copy";
import { useLocale } from "@/lib/i18n";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";

interface FotoFrame {
  url: string;
  position: string;
  zoom: number;
}

const fotoBannerDefault: Record<string, FotoFrame> = {
  "/destinasi": { url: "/images/u/1546484475-7f7bd55792da.jpg", position: "50% 50%", zoom: 1 },
  "/makanan": { url: "/images/kuliner-kei.jpg", position: "50% 50%", zoom: 1 },
  "/budaya": { url: "/images/u/1533900298318-6b8da08a523e.jpg", position: "50% 50%", zoom: 1 },
  "/bahasa": { url: "/images/u/1541417904950-b855846fe074.jpg", position: "50% 50%", zoom: 1 },
};

/**
 * Empat banner ajakan ringkas. Foto memenuhi kartu; keterbacaan teks
 * dijaga overlay gradien brand multi-stop yang melebur mulus ke foto
 * (tanpa sambungan patah), plus tombol gradien oranye khas hero.
 * `fotos` (dari setelan admin) menimpa foto bawaan bila ada.
 */
export function CtaBanner({
  fotos = fotoBannerDefault,
}: {
  fotos?: Record<string, FotoFrame>;
}) {
  const { t } = useLocale();
  const c = useCopy();

  return (
    <div className="container-page pb-(--spacing-section) [contain-intrinsic-size:auto_500px] [content-visibility:auto]">
      <StaggerGrid className="grid gap-5 sm:grid-cols-2">
        {t.banners.map((banner, i) => (
          <StaggerItem key={banner.href}>
            <Link
              href={banner.href}
              className="group focus-visible:ring-ring relative block overflow-hidden rounded-3xl shadow-lg transition-shadow duration-300 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <div className="relative h-44 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-105 md:h-48">
                <Image
                  src={(fotos[banner.href] ?? fotoBannerDefault[banner.href]).url}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  style={{
                    objectPosition: (fotos[banner.href] ?? fotoBannerDefault[banner.href]).position,
                    transform: `scale(${(fotos[banner.href] ?? fotoBannerDefault[banner.href]).zoom})`,
                    transformOrigin: (fotos[banner.href] ?? fotoBannerDefault[banner.href]).position,
                  }}
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(100deg, #0176c0 0%, rgba(1,118,192,0.92) 26%, rgba(1,105,178,0.62) 48%, rgba(1,89,160,0.28) 70%, rgba(1,89,160,0.05) 88%, transparent 100%)",
                  }}
                />
              </div>

              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <p className="font-display text-shadow-soft max-w-[15rem] text-lg leading-snug font-bold text-white md:text-xl">
                  {c(`banner_${i}_title`, banner.title)}
                </p>
                <span
                  className="inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f4784a, #d46634)",
                  }}
                >
                  {c(`banner_${i}_cta`, banner.cta)}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
}
