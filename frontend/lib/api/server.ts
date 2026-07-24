import "server-only";

import {
  fallbackBahasa,
  fallbackBudaya,
  fallbackMakanan,
} from "@/lib/content/fallback";
import { defaultSettings } from "@/lib/content/settings";
import { fallbackDestinasi } from "@/lib/content/spots";
import type {
  BahasaLokal,
  Budaya,
  Destinasi,
  Makanan,
  SiteSettings,
} from "@/lib/types";

const API_URL = process.env.API_URL;

/**
 * Fetcher RSC dengan cache tag untuk revalidasi on-demand dari admin.
 * Selama backend belum live (Fase 8), API_URL kosong dan semua fungsi
 * mengembalikan data fallback sesuai BR-002.
 */
async function fetchApi<T>(path: string, tag: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 3600, tags: [tag] },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data: T };
    return body.data;
  } catch {
    return null;
  }
}

export async function getFeaturedMakanan(): Promise<Makanan[]> {
  const data = await fetchApi<Makanan[]>("/api/v1/makanan/unggulan", "makanan");
  return data && data.length > 0
    ? data
    : fallbackMakanan.filter((m) => m.isUnggulan);
}

export async function getAllMakanan(): Promise<Makanan[]> {
  const data = await fetchApi<Makanan[]>("/api/v1/makanan", "makanan");
  return data && data.length > 0 ? data : fallbackMakanan;
}

export async function getMakananById(id: number): Promise<Makanan | null> {
  const all = await getAllMakanan();
  return all.find((m) => m.id === id) ?? null;
}

export async function getFeaturedBudaya(): Promise<Budaya[]> {
  const data = await fetchApi<Budaya[]>("/api/v1/budaya/unggulan", "budaya");
  return data && data.length > 0
    ? data
    : fallbackBudaya.filter((b) => b.isUnggulan);
}

export async function getAllBudaya(): Promise<Budaya[]> {
  const data = await fetchApi<Budaya[]>("/api/v1/budaya", "budaya");
  return data && data.length > 0 ? data : fallbackBudaya;
}

export async function getBudayaById(id: number): Promise<Budaya | null> {
  const all = await getAllBudaya();
  return all.find((b) => b.id === id) ?? null;
}

export async function getAllBahasa(): Promise<BahasaLokal[]> {
  const data = await fetchApi<BahasaLokal[]>("/api/v1/bahasa", "bahasa");
  return data && data.length > 0 ? data : fallbackBahasa;
}

export async function getAllDestinasi(): Promise<Destinasi[]> {
  const data = await fetchApi<Destinasi[]>("/api/v1/destinasi", "destinasi");
  return data && data.length > 0 ? data : fallbackDestinasi;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await fetchApi<SiteSettings>("/api/v1/settings", "settings");
  return data ?? defaultSettings;
}
