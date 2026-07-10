import {
  kategoriMakananTr,
  makananDescTr,
} from "@/lib/content/i18n-content";
import type { Makanan } from "@/lib/types";
import { ContentCard } from "@/components/cards/content-card";
import { Tr } from "@/components/site/tr";

export const kategoriMakananLabel: Record<Makanan["kategori"], string> = {
  makanan: "Makanan",
  minuman: "Minuman",
  kudapan: "Kudapan",
};

export function FoodCard({ item }: { item: Makanan }) {
  const kategoriTr = kategoriMakananTr[item.kategori];
  const descTr = makananDescTr[item.id];

  return (
    <ContentCard
      href={`/makanan/${item.id}`}
      fotoUrl={item.fotoUrl}
      nama={item.nama}
      kategori={
        <Tr
          id={kategoriMakananLabel[item.kategori]}
          en={kategoriTr?.en}
          zh={kategoriTr?.zh}
        />
      }
      deskripsi={<Tr id={item.deskripsi} en={descTr?.en} zh={descTr?.zh} />}
    />
  );
}
