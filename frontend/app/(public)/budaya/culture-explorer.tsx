"use client";

import { useMemo, useState } from "react";

import {
  budayaDescTr,
  kategoriBudayaTr,
} from "@/lib/content/i18n-content";
import { fmt, useLocale } from "@/lib/i18n";
import type { Budaya } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { ContentCard } from "@/components/cards/content-card";

export function CultureExplorer({ items }: { items: Budaya[] }) {
  const { t, locale } = useLocale();
  const pilih = (id: string, tr?: { en: string; zh: string }) =>
    locale === "en" ? (tr?.en ?? id) : locale === "zh" ? (tr?.zh ?? id) : id;
  const kategoriList = useMemo(
    () => ["Semua", ...Array.from(new Set(items.map((b) => b.kategori)))],
    [items]
  );
  const [kategori, setKategori] = useState("Semua");

  const visible = useMemo(
    () =>
      kategori === "Semua"
        ? items
        : items.filter((item) => item.kategori === kategori),
    [items, kategori]
  );

  return (
    <div>
      <div
        role="group"
        aria-label="Filter kategori budaya"
        className="flex flex-wrap gap-2"
      >
        {kategoriList.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKategori(k)}
            aria-pressed={kategori === k}
            className={cn(
              "focus-visible:ring-ring rounded-full px-5 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              kategori === k
                ? "bg-primary text-primary-foreground"
                : "bg-card hover:bg-secondary border"
            )}
          >
            {k === "Semua" ? t.common.semua : pilih(k, kategoriBudayaTr[k])}
          </button>
        ))}
      </div>

      <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
        {fmt(t.common.warisanDitampilkan, { n: visible.length })}
      </p>

      <StaggerGrid
        key={kategori}
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((item) => (
          <StaggerItem key={item.id}>
            <ContentCard
              href={`/budaya/${item.id}`}
              fotoUrl={item.fotoUrl}
              nama={item.nama}
              kategori={pilih(item.kategori, kategoriBudayaTr[item.kategori])}
              deskripsi={pilih(item.deskripsi, budayaDescTr[item.id])}
            />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
}
