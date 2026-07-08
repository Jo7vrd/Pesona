"use client";

import { useMemo, useState } from "react";

import type { KategoriMakanan, Makanan } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { FoodCard } from "@/components/cards/food-card";

const filters: { value: KategoriMakanan | "semua"; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "makanan", label: "Makanan" },
  { value: "minuman", label: "Minuman" },
  { value: "kudapan", label: "Kudapan" },
];

export function FoodExplorer({ items }: { items: Makanan[] }) {
  const [kategori, setKategori] = useState<KategoriMakanan | "semua">("semua");

  const visible = useMemo(
    () =>
      kategori === "semua"
        ? items
        : items.filter((item) => item.kategori === kategori),
    [items, kategori]
  );

  return (
    <div>
      <div
        role="group"
        aria-label="Filter kategori kuliner"
        className="flex flex-wrap gap-2"
      >
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setKategori(f.value)}
            aria-pressed={kategori === f.value}
            className={cn(
              "focus-visible:ring-ring rounded-full px-5 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              kategori === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-card hover:bg-secondary border"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
        {visible.length} sajian ditampilkan
      </p>

      {visible.length > 0 ? (
        <StaggerGrid
          key={kategori}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((item) => (
            <StaggerItem key={item.id}>
              <FoodCard item={item} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      ) : (
        <div className="bg-card mt-8 rounded-(--radius-card) border border-dashed p-12 text-center">
          <p className="font-medium">Belum ada sajian di kategori ini</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Coba pilih kategori lain.
          </p>
        </div>
      )}
    </div>
  );
}
