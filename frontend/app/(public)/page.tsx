import Image from "next/image";

import { getFeaturedBudaya, getFeaturedMakanan } from "@/lib/api/server";
import { BLUR_DATA_URL } from "@/lib/blur";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { FoodCard } from "@/components/cards/food-card";
import { SpotlightRow } from "@/components/cards/spotlight-row";
import { CtaBanner } from "@/components/site/cta-banner";
import { Hero } from "@/components/site/hero";
import {
  BudayaHeading,
  KulinerHeading,
  WelcomeCopy,
} from "@/components/site/landing-copy";
import { MarqueeStrip } from "@/components/site/marquee-strip";

export default async function LandingPage() {
  const [makanan, budaya] = await Promise.all([
    getFeaturedMakanan(),
    getFeaturedBudaya(),
  ]);

  return (
    <>
      <Hero />

      <section id="sambutan" className="section-y" aria-labelledby="sambutan-judul">
        <div className="container-page grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-5">
            <WelcomeCopy />
          </FadeIn>
          <FadeIn delay={0.15} className="lg:col-span-7">
            <div className="relative aspect-[16/11] overflow-hidden rounded-(--radius-card)">
              <Image
                src="/images/u/1544551763-46a013bb70d5.jpg"
                alt="Perairan jernih Kei Kecil dilihat dari atas"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-y bg-sand-100 dark:bg-ocean-900/30" aria-labelledby="kuliner-judul">
        <div className="container-page">
          <FadeIn className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <KulinerHeading />
          </FadeIn>
          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {makanan.slice(0, 4).map((item) => (
              <StaggerItem key={item.id}>
                <FoodCard item={item} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <MarqueeStrip />

      <section className="section-y" aria-labelledby="budaya-judul">
        <div className="container-page">
          <FadeIn className="mb-14">
            <BudayaHeading />
          </FadeIn>
          <div className="space-y-16 md:space-y-24">
            {budaya.slice(0, 2).map((item, i) => (
              <SpotlightRow key={item.id} item={item} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
