import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { BLUR_DATA_URL } from "@/lib/blur";
import { jenisSpotTr, spotDescTr } from "@/lib/content/i18n-content";
import { spots } from "@/lib/content/spots";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { TiltCard } from "@/components/motion/tilt-card";
import { CopyButton } from "@/components/site/copy-button";
import { PageHeader } from "@/components/site/page-header";
import { Tr } from "@/components/site/tr";

export const metadata: Metadata = {
  title: "Destinasi Wisata Kei Kecil",
  description:
    "Pantai Ngurbloat, Goa Hawang, Ngurtavur, Pulau Bair, dan destinasi terbaik Kei Kecil lengkap dengan foto dan koordinat GPS.",
  alternates: { canonical: "/destinasi" },
};

export default function DestinasiPage() {
  return (
    <>
      <PageHeader
        pageKey="destinasi"
        eyebrow="Destinasi"
        title="Tempat-tempat yang membuat Kei dikenang"
        description="Dari pasir sehalus tepung hingga laguna tersembunyi di balik karst, inilah alasan orang datang jauh-jauh ke ujung timur Indonesia."
        imageUrl="https://images.unsplash.com/photo-1546484475-7f7bd55792da?w=2000&q=80"
      />

      <section className="container-page py-12 md:py-16">
        <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {spots.map((spot) => (
            <StaggerItem key={spot.id}>
              <TiltCard className="h-full">
                <article className="group bg-card shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) flex h-full flex-col overflow-hidden rounded-(--radius-card) transition-shadow duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={spot.fotoUrl}
                    alt={spot.nama}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <Badge className="bg-background/85 text-foreground absolute top-3 left-3 rounded-full border-0 backdrop-blur-sm">
                    <Tr
                      id={spot.jenis}
                      en={jenisSpotTr[spot.jenis]?.en}
                      zh={jenisSpotTr[spot.jenis]?.zh}
                    />
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-xl font-semibold">
                    {spot.nama}
                  </h2>
                  <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                    <Tr
                      id={spot.deskripsi}
                      en={spotDescTr[spot.id]?.en}
                      zh={spotDescTr[spot.id]?.zh}
                    />
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <span className="text-muted-foreground inline-flex items-center gap-1.5 font-mono text-xs">
                      <MapPin
                        className="text-lagoon-600 size-3.5"
                        aria-hidden
                      />
                      {spot.lat}, {spot.lng}
                    </span>
                    <CopyButton
                      value={`${spot.lat}, ${spot.lng}`}
                      label={`Salin koordinat ${spot.nama}`}
                    />
                  </div>
                </div>
                </article>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <FadeIn className="mt-12 text-center">
          <Link
            href="/peta"
            className="text-lagoon-700 hover:text-lagoon-600 inline-flex items-center gap-1.5 font-semibold transition-colors"
          >
            <Tr
              id="Lihat semua titik di peta interaktif"
              en="See every spot on the interactive map"
              zh="在互动地图上查看所有地点"
            />
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
