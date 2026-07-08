import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Languages, LifeBuoy, MapPin, Users } from "lucide-react";

import { getFeaturedBudaya, getFeaturedMakanan } from "@/lib/api/server";
import { siteConfig } from "@/lib/content/site";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { FoodCard } from "@/components/cards/food-card";
import { ShortcutCard } from "@/components/cards/shortcut-card";
import { SpotlightRow } from "@/components/cards/spotlight-row";
import { Hero } from "@/components/site/hero";

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
            <p className="eyebrow mb-4">Selamat datang</p>
            <h2 id="sambutan-judul" className="font-display text-display-lg text-balance">
              Desa kecil, kekayaan yang tak terkira
            </h2>
            <p className="text-muted-foreground mt-6 leading-relaxed">
              Kei Kecil adalah rumah bagi pantai berpasir paling halus di
              dunia, terumbu karang yang dijaga hukum adat Sasi, dan
              masyarakat yang hidup selaras dengan laut. Situs ini adalah
              pintu masuk Anda — dari kuliner khas hingga kosakata bahasa Kei
              untuk menyapa warga.
            </p>
            <p className="mt-4 text-sm font-medium">
              {siteConfig.desa.nama} · {siteConfig.desa.kabupaten}
            </p>
          </FadeIn>
          <FadeIn delay={0.15} className="lg:col-span-7">
            <div className="relative aspect-[16/11] overflow-hidden rounded-(--radius-card)">
              <Image
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1800&q=80"
                alt="Perairan jernih Kei Kecil dilihat dari atas"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-y bg-sand-100" aria-labelledby="kuliner-judul">
        <div className="container-page">
          <FadeIn className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-4">Kuliner unggulan</p>
              <h2 id="kuliner-judul" className="font-display text-display-lg text-balance">
                Cita rasa dari tanah dan laut Kei
              </h2>
            </div>
            <Link
              href="/makanan"
              className="text-lagoon-700 hover:text-lagoon-600 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
            >
              Lihat semua kuliner
              <ArrowRight className="size-4" aria-hidden />
            </Link>
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

      <section className="section-y" aria-labelledby="budaya-judul">
        <div className="container-page">
          <FadeIn className="mb-14">
            <p className="eyebrow mb-4">Budaya &amp; tradisi</p>
            <h2 id="budaya-judul" className="font-display text-display-lg max-w-2xl text-balance">
              Warisan yang menjaga laut tetap hidup
            </h2>
          </FadeIn>
          <div className="space-y-16 md:space-y-24">
            {budaya.slice(0, 2).map((item, i) => (
              <SpotlightRow key={item.id} item={item} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-sand-100" aria-labelledby="akses-judul">
        <div className="container-page">
          <FadeIn className="mb-10">
            <p className="eyebrow mb-4">Akses cepat</p>
            <h2 id="akses-judul" className="font-display text-display-lg text-balance">
              Siapkan perjalanan Anda
            </h2>
          </FadeIn>
          <StaggerGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <ShortcutCard
                href="/peta"
                icon={MapPin}
                title="Peta terumbu karang"
                description="Titik snorkeling terbaik beserta koordinat GPS-nya."
              />
            </StaggerItem>
            <StaggerItem>
              <ShortcutCard
                href="/bahasa"
                icon={Languages}
                title="Bahasa Kei"
                description="Kamus praktis untuk menyapa warga dalam bahasa lokal."
              />
            </StaggerItem>
            <StaggerItem>
              <ShortcutCard
                href="/kedaruratan"
                icon={LifeBuoy}
                title="Kedaruratan pesisir"
                description="Kontak penting dan panduan P3K saat di pantai."
              />
            </StaggerItem>
            <StaggerItem>
              <ShortcutCard
                href="/budaya"
                icon={Users}
                title="Budaya Kei"
                description="Sasi, Larvul Ngabal, dan tradisi yang masih hidup."
              />
            </StaggerItem>
          </StaggerGrid>
        </div>
      </section>
    </>
  );
}
