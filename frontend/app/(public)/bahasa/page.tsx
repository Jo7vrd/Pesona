import type { Metadata } from "next";

import { getAllBahasa } from "@/lib/api/server";
import { PageHeader } from "@/components/site/page-header";
import { DictionarySearch } from "./dictionary-search";

export const metadata: Metadata = {
  title: "Kamus Bahasa Kei",
  description:
    "Kamus praktis Bahasa Indonesia ke Bahasa Kei (Veveu Evav). Pelajari kosakata dasar untuk menyapa dan berbincang dengan warga Kei Kecil.",
  alternates: { canonical: "/bahasa" },
};

export default async function BahasaPage() {
  const entries = await getAllBahasa();

  return (
    <>
      <PageHeader
        pageKey="bahasa"
        eyebrow="Bahasa Kei"
        title="Sapa warga dengan bahasanya sendiri"
        description="Beberapa kata Kei yang Anda ucapkan akan membuka lebih banyak senyum daripada seribu foto. Mulai dari sini."
        imageUrl="https://images.unsplash.com/photo-1541417904950-b855846fe074?w=2000&q=80"
      />
      <section className="container-page py-12 md:py-16">
        <DictionarySearch entries={entries} />
      </section>
    </>
  );
}
