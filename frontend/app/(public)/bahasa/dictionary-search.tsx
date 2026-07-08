"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { BahasaLokal } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/site/copy-button";

export function DictionarySearch({ entries }: { entries: BahasaLokal[] }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.bahasaIndonesia.toLowerCase().includes(q) ||
        e.bahasaKei.toLowerCase().includes(q)
    );
  }, [entries, query]);

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
          placeholder="Cari kata — misalnya laut, ikan, kampung…"
          aria-label="Cari kosakata bahasa Kei"
          className="bg-card h-14 rounded-full pl-12 text-base shadow-(--shadow-card)"
        />
      </div>

      <p className="text-muted-foreground mt-4 text-sm" aria-live="polite">
        {visible.length} dari {entries.length} kosakata
      </p>

      {visible.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {visible.map((entry) => (
            <li
              key={entry.id}
              className="bg-card flex items-center justify-between gap-4 rounded-2xl border p-5"
            >
              <div className="min-w-0">
                <p className="text-muted-foreground text-sm">
                  {entry.bahasaIndonesia}
                </p>
                <p className="font-display mt-1 text-2xl">{entry.bahasaKei}</p>
                {entry.catatan ? (
                  <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                    {entry.catatan}
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
        <div className="bg-card mt-6 rounded-(--radius-card) border border-dashed p-12 text-center">
          <p className="font-medium">Kata &ldquo;{query}&rdquo; belum ada</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Kamus ini terus dilengkapi oleh warga desa. Coba kata lain.
          </p>
        </div>
      )}
    </div>
  );
}
