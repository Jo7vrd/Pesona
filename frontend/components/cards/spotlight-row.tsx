import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BLUR_DATA_URL } from "@/lib/blur";
import {
  budayaDescTr,
  kategoriBudayaTr,
} from "@/lib/content/i18n-content";
import type { Budaya } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion/fade-in";
import { Tr } from "@/components/site/tr";

export function SpotlightRow({ item, flip }: { item: Budaya; flip?: boolean }) {
  return (
    <FadeIn>
      <article className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
        <div
          className={cn(
            "relative aspect-[16/10] overflow-hidden rounded-(--radius-card) md:col-span-7",
            flip && "md:order-2"
          )}
        >
          <Image
            src={item.fotoUrl}
            alt={item.nama}
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        </div>
        <div className={cn("md:col-span-5", flip && "md:order-1")}>
          <p className="eyebrow mb-3">
            <Tr
              id={item.kategori}
              en={kategoriBudayaTr[item.kategori]?.en}
              zh={kategoriBudayaTr[item.kategori]?.zh}
            />
          </p>
          <h3 className="font-display text-display text-balance">
            {item.nama}
          </h3>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            <Tr
              id={item.deskripsi}
              en={budayaDescTr[item.id]?.en}
              zh={budayaDescTr[item.id]?.zh}
            />
          </p>
          <Link
            href={`/budaya/${item.id}`}
            className="text-lagoon-700 hover:text-lagoon-600 mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
          >
            <Tr id="Pelajari lebih lanjut" en="Learn more" zh="了解更多" />
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </article>
    </FadeIn>
  );
}
