import type { Metadata } from "next";

import { getAllBahasa, getSiteSettings } from "@/lib/api/server";
import { FadeIn } from "@/components/motion/fade-in";
import { PageHeader } from "@/components/site/page-header";
import { Tr } from "@/components/site/tr";
import { YouTubeEmbed } from "@/components/site/youtube-embed";
import { DictionarySearch } from "./dictionary-search";

export const metadata: Metadata = {
  title: "Kamus Bahasa Kei",
  description:
    "Kamus praktis Bahasa Indonesia ke Bahasa Kei (Veveu Evav). Pelajari kosakata dasar untuk menyapa dan berbincang dengan warga Kei Kecil.",
  alternates: { canonical: "/bahasa" },
};

export default async function BahasaPage() {
  const [entries, settings] = await Promise.all([
    getAllBahasa(),
    getSiteSettings(),
  ]);

  return (
    <>
      <PageHeader
        pageKey="bahasa"
        eyebrow="Bahasa Kei"
        title="Sapa warga dengan bahasanya sendiri"
        description="Beberapa kata Kei yang Anda ucapkan akan membuka lebih banyak senyum daripada seribu foto. Mulai dari sini."
        imageUrl="/images/u/1541417904950-b855846fe074.jpg"
      />
      <section className="container-page py-12 md:py-16">
        <DictionarySearch entries={entries} />

        {settings.bahasaVideo ? (
          <FadeIn className="mt-16 md:mt-24">
            <p className="eyebrow mb-4">
              <Tr id="Video" en="Video" zh="视频" />
            </p>
            <h2 className="font-display text-display-lg text-shadow-soft max-w-2xl font-semibold text-balance">
              <Tr
                id="Dengarkan langsung Bahasa Kei"
                en="Hear the Kei language spoken"
                zh="聆听基伊语的发音"
              />
            </h2>
            <div className="mt-8 max-w-3xl">
              <YouTubeEmbed
                url={settings.bahasaVideo}
                title="Bahasa Kei (Veveu Evav)"
              />
            </div>
          </FadeIn>
        ) : null}
      </section>
    </>
  );
}
