import type { Metadata } from "next";

import { getAllBudaya } from "@/lib/api/server";
import { PageHeader } from "@/components/site/page-header";
import { CultureExplorer } from "./culture-explorer";

export const metadata: Metadata = {
  title: "Budaya & Tradisi Kei Kecil",
  description:
    "Kenali Sasi, Larvul Ngabal, Festival Meti Kei, dan warisan budaya Kepulauan Kei yang masih hidup hingga hari ini.",
  alternates: { canonical: "/budaya" },
};

export default async function BudayaPage() {
  const items = await getAllBudaya();

  return (
    <>
      <PageHeader
        pageKey="budaya"
        eyebrow="Budaya & tradisi"
        title="Warisan yang menjaga laut tetap hidup"
        description="Di Kei, adat bukan pajangan masa lalu, ia mengatur kapan laut boleh dipanen, bagaimana tamu dihormati, dan bagaimana sengketa diselesaikan."
        imageUrl="/images/u/1533900298318-6b8da08a523e.jpg"
      />
      <section className="container-page py-12 md:py-16">
        <CultureExplorer items={items} />
      </section>
    </>
  );
}
