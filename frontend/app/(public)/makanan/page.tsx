import type { Metadata } from "next";

import { getAllMakanan, getPageHeroImage } from "@/lib/api/server";
import { PageHeader } from "@/components/site/page-header";
import { FoodExplorer } from "./food-explorer";

export const metadata: Metadata = {
  title: "Kuliner Khas Kei Kecil",
  description:
    "Jelajahi makanan, minuman, dan kudapan khas Kei Kecil, dari embal hingga ikan bakar segar hasil tangkapan nelayan lokal.",
  alternates: { canonical: "/makanan" },
};

export default async function MakananPage() {
  const [items, heroImg] = await Promise.all([
    getAllMakanan(),
    getPageHeroImage("makanan", "/images/kuliner-kei.jpg"),
  ]);

  return (
    <>
      <PageHeader
        pageKey="makanan"
        eyebrow="Kuliner"
        title="Cita rasa dari tanah dan laut Kei"
        description="Makanan pokok dari singkong, hasil laut yang diambil secukupnya, dan rempah yang tumbuh di pekarangan, inilah meja makan masyarakat Kei."
        imageUrl={heroImg}
      />
      <section className="container-page py-12 md:py-16">
        <FoodExplorer items={items} />
      </section>
    </>
  );
}
