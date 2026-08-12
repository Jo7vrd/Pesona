"use client";

import { createContext, useContext, type ReactNode } from "react";

import { useLocale } from "@/lib/i18n";

/**
 * Override teks beranda yang dikelola admin: field → bahasa → teks.
 * Disediakan dari setelan situs (server) dan dipakai komponen beranda
 * lewat useCopy(). Bila field/bahasa tidak ada, komponen memakai teks
 * bawaan i18n (fallback), sehingga aman meski belum diedit.
 */
export type BerandaTeks = Record<string, Record<string, string>>;

const BerandaCopyContext = createContext<BerandaTeks | undefined>(undefined);

export function BerandaCopyProvider({
  value,
  children,
}: {
  value?: BerandaTeks;
  children: ReactNode;
}) {
  return (
    <BerandaCopyContext.Provider value={value}>
      {children}
    </BerandaCopyContext.Provider>
  );
}

/**
 * Mengembalikan fungsi c(field, fallback) yang memberi teks override untuk
 * bahasa aktif bila ada, jika tidak memakai fallback (teks i18n bawaan).
 */
export function useCopy() {
  const { locale } = useLocale();
  const map = useContext(BerandaCopyContext);
  return (field: string, fallback: string): string =>
    map?.[field]?.[locale]?.trim() || fallback;
}
