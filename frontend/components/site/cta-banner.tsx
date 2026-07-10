"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BLUR_DATA_URL } from "@/lib/blur";
import { useLocale } from "@/lib/i18n";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";

const fotoBanner: Record<string, string> = {
  "/destinasi":
    "/images/u/1546484475-7f7bd55792da.jpg",
  "/makanan": "/images/kuliner-kei.jpg",
  "/budaya":
    "/images/u/1533900298318-6b8da08a523e.jpg",
  "/bahasa":
    "/images/u/1541417904950-b855846fe074.jpg",
};

/**
 * Empat banner ajakan ringkas. Foto memenuhi kartu; keterbacaan teks
 * dijaga overlay gradien brand multi-stop yang melebur mulus ke foto
 * (tanpa sambungan patah), plus tombol gradien oranye khas hero.
 */
export function CtaBanner() {
  const { t } = useLocale();

  return (
    <div className="container-page pb-(--spacing-section) [contain-intrinsic-size:auto_500px] [content-visibility:auto]">
      <StaggerGrid className="grid gap-5 sm:grid-cols-2">
        {t.banners.map((banner) => (
          <StaggerItem key={banner.href}>
            <Link
              href={banner.href}
              className="group focus-visible:ring-ring relative block overflow-hidden rounded-3xl shadow-lg transition-shadow duration-300 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <div className="relative h-44 md:h-48">
                <Image
                  src={fotoBanner[banner.href]}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
                  {banner.title}
                </p>
                <span
                  className="inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f4784a, #d46634)",
                  }}
                >
                  {banner.cta}
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
