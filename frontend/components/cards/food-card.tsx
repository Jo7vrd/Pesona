import type { Makanan } from "@/lib/types";
import { ContentCard } from "@/components/cards/content-card";

export const kategoriMakananLabel: Record<Makanan["kategori"], string> = {
  makanan: "Makanan",
  minuman: "Minuman",
  kudapan: "Kudapan",
};

export function FoodCard({ item }: { item: Makanan }) {
  return (
    <ContentCard
      href={`/makanan/${item.id}`}
      fotoUrl={item.fotoUrl}
      nama={item.nama}
      kategori={kategoriMakananLabel[item.kategori]}
      deskripsi={item.deskripsi}
    />
  );
}
