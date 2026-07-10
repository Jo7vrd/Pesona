import type { Metadata } from "next";
import { MapPin } from "lucide-react";

import { jenisSpotTr, spotDescTr } from "@/lib/content/i18n-content";
import { spots } from "@/lib/content/spots";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { CopyButton } from "@/components/site/copy-button";
import { PageHeader } from "@/components/site/page-header";
import { Tr } from "@/components/site/tr";

export const metadata: Metadata = {
  title: "Peta Terumbu Karang & Titik Snorkeling",
  description:
    "Peta interaktif titik snorkeling, pantai, dan laguna terbaik di Kei Kecil lengkap dengan koordinat GPS.",
  alternates: { canonical: "/peta" },
};

export default function PetaPage() {
  return (
    <>
      <PageHeader
        pageKey="peta"
        eyebrow="Peta karang"
        title="Temukan titik terbaik di perairan Kei"
        description="Pantai, laguna, dan taman karang pilihan beserta koordinatnya. Hormati aturan sasi: bila ada tanda larangan, jangan memanen apa pun."
        imageUrl="https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=2000&q=80"
      />

      <section className="container-page py-12 md:py-16">
        <FadeIn>
          <div className="overflow-hidden rounded-(--radius-card) border shadow-(--shadow-card)">
            <iframe
              title="Peta Kei Kecil, OpenStreetMap"
              src="https://www.openstreetmap.org/export/embed.html?bbox=132.35%2C-6.00%2C132.95%2C-5.30&layer=mapnik"
              className="h-[420px] w-full md:h-[520px]"
              loading="lazy"
            />
          </div>
          <p className="text-muted-foreground mt-3 text-xs">
            <Tr
              id="Peta oleh OpenStreetMap. Koordinat di bawah adalah perkiraan, selalu konfirmasi rute dengan pemandu lokal."
              en="Map by OpenStreetMap. Coordinates below are approximate; always confirm routes with a local guide."
              zh="地图来自OpenStreetMap。以下坐标为大致位置，请务必与当地向导确认路线。"
            />
          </p>
        </FadeIn>

        <StaggerGrid className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {spots.map((spot) => (
            <StaggerItem key={spot.id}>
              <article className="bg-card flex h-full flex-col rounded-(--radius-card) border p-6 shadow-(--shadow-card)">
                <div className="flex items-start justify-between gap-3">
                  <Badge variant="secondary" className="rounded-full">
                    <Tr
                      id={spot.jenis}
                      en={jenisSpotTr[spot.jenis]?.en}
                      zh={jenisSpotTr[spot.jenis]?.zh}
                    />
                  </Badge>
                  <CopyButton
                    value={`${spot.lat}, ${spot.lng}`}
                    label={`Salin koordinat ${spot.nama}`}
                  />
                </div>
                <h2 className="font-display mt-4 text-xl">{spot.nama}</h2>
                <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                  <Tr
                    id={spot.deskripsi}
                    en={spotDescTr[spot.id]?.en}
                    zh={spotDescTr[spot.id]?.zh}
                  />
                </p>
                <p className="text-muted-foreground mt-4 inline-flex items-center gap-1.5 font-mono text-xs">
                  <MapPin className="text-lagoon-600 size-3.5" aria-hidden />
                  {spot.lat}, {spot.lng}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </>
  );
}
