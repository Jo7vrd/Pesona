import axios from "axios";

import { mockDb } from "@/lib/api/mock-db";
import type { BahasaInput } from "@/lib/schemas/bahasa";
import type { BudayaInput } from "@/lib/schemas/budaya";
import type { DestinasiInput } from "@/lib/schemas/destinasi";
import type { MakananInput } from "@/lib/schemas/makanan";
import type {
  AdminSession,
  BahasaLokal,
  Budaya,
  DashboardStats,
  Destinasi,
  HeroImage,
  Makanan,
  SiteSettings,
} from "@/lib/types";

export interface HeroImageInput {
  fotoUrl: string;
  urutan: number;
}

/**
 * Kontrak API admin. Ada dua implementasi:
 * - HTTP (axios) ke backend Go saat NEXT_PUBLIC_API_URL di-set (Fase 8)
 * - Mock localStorage untuk pengembangan & demo tanpa backend
 *
 * Komponen TIDAK boleh tahu implementasi mana yang aktif.
 */

export const SESSION_COOKIE = "kk_admin_session";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Sesi 8 jam (§7.1). Di mode mock cookie di-set dari klien; backend
 * asli memakai httpOnly cookie dari server (BR-001), jadi no-op.
 */
export function setMockSessionCookie(): void {
  if (!isMockMode) return;
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${8 * 60 * 60}; samesite=lax`;
}

interface Collection<T, I> {
  list(): Promise<T[]>;
  create(input: I): Promise<T>;
  update(id: number, input: I): Promise<T>;
  remove(id: number): Promise<void>;
}

export interface AdminApi {
  login(username: string, password: string): Promise<AdminSession>;
  logout(): Promise<void>;
  getSession(): AdminSession | null;
  stats(): Promise<DashboardStats>;
  makanan: Collection<Makanan, MakananInput>;
  budaya: Collection<Budaya, BudayaInput>;
  bahasa: Collection<BahasaLokal, BahasaInput>;
  destinasi: Collection<Destinasi, DestinasiInput>;
  hero: {
    list(): Promise<HeroImage[]>;
    create(input: HeroImageInput): Promise<HeroImage>;
    remove(id: number): Promise<void>;
  };
  settings: {
    get(): Promise<SiteSettings>;
    update(input: SiteSettings): Promise<SiteSettings>;
  };
}

/**
 * Unggah foto ke backend dan kembalikan URL publiknya. Di mode mock
 * file dikembalikan sebagai data URL (tanpa backend). Dengan backend
 * asli, file dikirim ke endpoint upload yang menyusutkan & menyimpannya.
 */
export async function uploadImage(
  file: File,
  modul: string
): Promise<string> {
  if (isMockMode) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Gagal membaca file."));
      reader.readAsDataURL(file);
    });
  }
  const form = new FormData();
  form.append("foto", file);
  form.append("modul", modul);
  try {
    const res = await axios.post<{ data: { url: string } }>(
      `${API_URL}/api/v1/admin/upload`,
      form,
      { withCredentials: true }
    );
    return res.data.data.url;
  } catch (error) {
    const message =
      (axios.isAxiosError(error) && error.response?.data?.message) ||
      "Gagal mengunggah foto. Coba lagi.";
    throw new Error(message);
  }
}

function httpApi(baseURL: string): AdminApi {
  const http = axios.create({ baseURL, withCredentials: true });

  http.interceptors.response.use(undefined, (error) => {
    const message =
      error.response?.data?.message ??
      "Tidak dapat terhubung ke server. Coba lagi.";
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.assign("/admin/login");
    }
    return Promise.reject(new Error(message));
  });

  function collection<T, I>(resource: string): Collection<T, I> {
    return {
      list: async () =>
        (await http.get<{ data: T[] }>(`/api/v1/admin/${resource}`)).data.data,
      create: async (input) =>
        (await http.post<{ data: T }>(`/api/v1/admin/${resource}`, input)).data
          .data,
      update: async (id, input) =>
        (await http.put<{ data: T }>(`/api/v1/admin/${resource}/${id}`, input))
          .data.data,
      remove: async (id) => {
        await http.delete(`/api/v1/admin/${resource}/${id}`);
      },
    };
  }

  return {
    login: async (username, password) =>
      (
        await http.post<{ data: AdminSession }>("/api/v1/auth/login", {
          username,
          password,
        })
      ).data.data,
    logout: async () => {
      await http.post("/api/v1/auth/logout");
    },
    // Dengan backend asli, identitas dibaca dari JWT httpOnly via /me;
    // sesi lokal hanya cache tampilan
    getSession: () => mockDb.getSession(),
    stats: async () =>
      (await http.get<{ data: DashboardStats }>("/api/v1/admin/stats")).data
        .data,
    makanan: collection("makanan"),
    budaya: collection("budaya"),
    bahasa: collection("bahasa"),
    destinasi: collection("destinasi"),
    hero: {
      list: async () =>
        (await http.get<{ data: HeroImage[] }>("/api/v1/admin/hero")).data.data,
      create: async (input) =>
        (await http.post<{ data: HeroImage }>("/api/v1/admin/hero", input)).data
          .data,
      remove: async (id) => {
        await http.delete(`/api/v1/admin/hero/${id}`);
      },
    },
    settings: {
      get: async () =>
        (await http.get<{ data: SiteSettings }>("/api/v1/admin/settings")).data
          .data,
      update: async (input) =>
        (await http.put<{ data: SiteSettings }>("/api/v1/admin/settings", input))
          .data.data,
    },
  };
}

const mockApi: AdminApi = {
  login: (username, password) => mockDb.login(username, password),
  logout: () => mockDb.logout(),
  getSession: () => mockDb.getSession(),
  stats: () => mockDb.stats(),
  makanan: mockDb.makanan,
  budaya: mockDb.budaya,
  bahasa: mockDb.bahasa,
  destinasi: mockDb.destinasi,
  hero: mockDb.hero,
  settings: mockDb.settings,
};

export const adminApi: AdminApi = API_URL ? httpApi(API_URL) : mockApi;
export const isMockMode = !API_URL;
