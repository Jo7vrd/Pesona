import type { Metadata } from "next";

import { getAllMakanan, getPageHero } from "@/lib/api/server";
import { PageHeader } from "@/components/site/page-header";
import { FoodExplorer } from "./food-explorer";

export const metadata: Metadata = {
  title: "Kuliner Khas Kei Kecil",
  description:
    "Jelajahi makanan, minuman, dan kudapan khas Kei Kecil, dari embal hingga ikan bakar segar hasil tangkapan nelayan lokal.",
  alternates: { canonical: "/makanan" },
};

export default async function MakananPage() {
  const [items, hero] = await Promise.all([
    getAllMakanan(),
    getPageHero("makanan", "/images/kuliner-kei.jpg"),
  ]);

  return (
    <>
      <PageHeader
        pageKey="makanan"
        eyebrow="Kuliner"
        title="Cita rasa dari tanah dan laut Kei"
        description="Makanan pokok dari singkong, hasil laut yang diambil secukupnya, dan rempah yang tumbuh di pekarangan, inilah meja makan masyarakat Kei."
        imageUrl={hero.url}
        imagePosition={hero.position}
        imageZoom={hero.zoom}
      />
      <section className="container-page py-12 md:py-16">
        <FoodExplorer items={items} />
      </section>
    </>
  );
}
