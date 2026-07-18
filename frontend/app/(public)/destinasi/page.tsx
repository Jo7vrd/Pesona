import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { getAllDestinasi } from "@/lib/api/server";
import { BLUR_DATA_URL } from "@/lib/blur";
import { jenisSpotTr, spotDescTr } from "@/lib/content/i18n-content";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { TiltCard } from "@/components/motion/tilt-card";
import { PageHeader } from "@/components/site/page-header";
import { Tr } from "@/components/site/tr";
import { YouTubeEmbed } from "@/components/site/youtube-embed";

export const metadata: Metadata = {
  title: "Destinasi Wisata Kei Kecil",
  description:
    "Pantai Ngurbloat, Goa Hawang, Ngurtavur, Pulau Bair, dan destinasi terbaik Kei Kecil lengkap dengan foto dan koordinat GPS.",
  alternates: { canonical: "/destinasi" },
};

export default async function DestinasiPage() {
  const spots = await getAllDestinasi();
  const denganVideo = spots.filter((s) => s.videoYoutube);

  return (
    <>
      <PageHeader
        pageKey="destinasi"
        eyebrow="Destinasi"
        title="Tempat-tempat yang membuat Kei dikenang"
        description="Dari pasir sehalus tepung hingga laguna tersembunyi di balik karst, inilah alasan orang datang jauh-jauh ke ujung timur Indonesia."
        imageUrl="/images/u/1546484475-7f7bd55792da.jpg"
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
                  <div className="mt-4 border-t pt-4">
                    <a
                      href={`https://www.google.com/maps?q=${spot.lat},${spot.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lagoon-700 hover:text-lagoon-600 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                    >
                      <MapPin className="size-4" aria-hidden />
                      <Tr
                        id="Buka di Google Maps"
                        en="Open in Google Maps"
                        zh="在谷歌地图中打开"
                      />
                    </a>
                  </div>
                </div>
                </article>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {denganVideo.length > 0 ? (
          <FadeIn className="mt-16 md:mt-24">
            <p className="eyebrow mb-4">
              <Tr id="Video" en="Video" zh="视频" />
            </p>
            <div className="grid gap-8 lg:grid-cols-2">
              {denganVideo.map((spot) => (
                <figure key={spot.id}>
                  <YouTubeEmbed url={spot.videoYoutube!} title={spot.nama} />
                  <figcaption className="text-muted-foreground mt-3 text-sm font-medium">
                    {spot.nama}
                  </figcaption>
                </figure>
              ))}
            </div>
          </FadeIn>
        ) : null}

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
