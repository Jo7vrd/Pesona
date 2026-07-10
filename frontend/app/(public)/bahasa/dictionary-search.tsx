"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import {
  bahasaCatatanTr,
  bahasaGlossTr,
} from "@/lib/content/i18n-content";
import { fmt, useLocale } from "@/lib/i18n";
import type { BahasaLokal } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/site/copy-button";

export function DictionarySearch({ entries }: { entries: BahasaLokal[] }) {
  const { t, locale } = useLocale();
  const [query, setQuery] = useState("");

  // Tampilkan glos sesuai bahasa antarmuka; kata Kei selalu tetap
  const glos = (e: BahasaLokal) =>
    locale === "en"
      ? (bahasaGlossTr[e.id]?.en ?? e.bahasaIndonesia)
      : locale === "zh"
        ? (bahasaGlossTr[e.id]?.zh ?? e.bahasaIndonesia)
        : e.bahasaIndonesia;

  const catatan = (e: BahasaLokal) =>
    locale === "en"
      ? (bahasaCatatanTr[e.id]?.en ?? e.catatan)
      : locale === "zh"
        ? (bahasaCatatanTr[e.id]?.zh ?? e.catatan)
        : e.catatan;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.bahasaIndonesia.toLowerCase().includes(q) ||
        e.bahasaKei.toLowerCase().includes(q) ||
        glos(e).toLowerCase().includes(q)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, query, locale]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative">
        <Search
          className="text-muted-foreground absolute top-1/2 left-4 size-5 -translate-y-1/2"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.common.cariKosakata}
          aria-label="Cari kosakata bahasa Kei"
          className="bg-card h-14 rounded-full pl-12 text-base shadow-(--shadow-card)"
        />
      </div>

      <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
        {fmt(t.common.kosakataCount, { a: visible.length, b: entries.length })}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {visible.map((entry) => (
            <li
              key={entry.id}
              className="bg-card flex items-center justify-between gap-4 rounded-2xl border p-5"
            >
              <div className="min-w-0">
                <p className="text-muted-foreground text-sm">{glos(entry)}</p>
                <p className="font-display mt-1 text-2xl">{entry.bahasaKei}</p>
                {catatan(entry) ? (
                  <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                    {catatan(entry)}
                  </p>
                ) : null}
              </div>
              <CopyButton
                value={`${entry.bahasaIndonesia} = ${entry.bahasaKei}`}
                label={`Salin ${entry.bahasaKei}`}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="bg-card mt-6 rounded-card border border-dashed p-12 text-center">
          <p className="font-medium">{fmt(t.common.kataBelumAda, { q: query })}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            {t.common.kamusCatatan}
          </p>
        </div>
      )}
    </div>
  );
}
