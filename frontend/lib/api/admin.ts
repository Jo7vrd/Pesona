import axios from "axios";

import { mockDb } from "@/lib/api/mock-db";
import type { BahasaInput } from "@/lib/schemas/bahasa";
import type { BudayaInput } from "@/lib/schemas/budaya";
import type { DestinasiInput } from "@/lib/schemas/destinasi";
import type { MakananInput } from "@/lib/schemas/makanan";
import type {
  AdminAccount,
  AdminSession,
  AdminUser,
  BahasaLokal,
  Budaya,
  DashboardStats,
  Destinasi,
  EmergencyContact,
  HeroImage,
  Makanan,
  SiteSettings,
} from "@/lib/types";

export type EmergencyContactInput = Omit<EmergencyContact, "id">;

export interface HeroImageInput {
  fotoUrl: string;
  fotoPosisi?: string;
  fotoZoom?: number;
  urutan: number;
}

export interface CreateAdminInput {
  nama: string;
  username: string;
  password: string;
  role: "admin" | "super_admin";
}

export interface UpdateAdminInput {
  nama: string;
  role: "admin" | "super_admin";
  isActive: boolean;
}

/**
 * Kontrak API admin. Ada dua implementasi:
 * - HTTP (axios) ke backend Go saat NEXT_PUBLIC_API_URL di-set (Fase 8)
 * - Mock localStorage untuk pengembangan & demo tanpa backend
 *
 * Komponen TIDAK boleh tahu implementasi mana yang aktif.
 */

export const SESSION_COOKIE = "kk_admin_session";
const TOKEN_KEY = "kk_admin_token";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Token JWT disimpan di localStorage dan dikirim sebagai header Bearer.
// Ini menghindari masalah cookie lintas-domain (frontend Vercel ↔ backend
// Railway) yang sering diblokir browser sebagai cookie pihak-ketiga.
function storeToken(token: string): void {
  if (typeof window !== "undefined") window.localStorage.setItem(TOKEN_KEY, token);
}
function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  // Bersihkan juga cookie gerbang agar proxy.ts tidak menahan di /admin.
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
function readToken(): string | null {
  return typeof window !== "undefined"
    ? window.localStorage.getItem(TOKEN_KEY)
    : null;
}

/**
 * Sesi 8 jam (§7.1). Di mode mock cookie di-set dari klien; backend
 * asli memakai httpOnly cookie dari server (BR-001), jadi no-op.
 */
export function setMockSessionCookie(): void {
  if (typeof window === "undefined") return;
  // Cookie gerbang UX (first-party, di domain frontend) yang dibaca
  // proxy.ts untuk mengizinkan /admin/**. Berlaku di mode mock MAUPUN
  // backend nyata — otorisasi sebenarnya tetap lewat token Bearer.
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
  /** Identitas terkini dari JWT httpOnly (backend asli) atau sesi mock. */
  me(): Promise<AdminUser | null>;
  stats(): Promise<DashboardStats>;
  makanan: Collection<Makanan, MakananInput>;
  budaya: Collection<Budaya, BudayaInput>;
  bahasa: Collection<BahasaLokal, BahasaInput>;
  destinasi: Collection<Destinasi, DestinasiInput>;
  kedaruratan: Collection<EmergencyContact, EmergencyContactInput>;
  hero: {
    list(): Promise<HeroImage[]>;
    create(input: HeroImageInput): Promise<HeroImage>;
    reorder(ids: number[]): Promise<void>;
    remove(id: number): Promise<void>;
  };
  admins: {
    list(): Promise<AdminAccount[]>;
    create(input: CreateAdminInput): Promise<AdminAccount>;
    update(id: number, input: UpdateAdminInput): Promise<AdminAccount>;
    resetPassword(id: number, password: string): Promise<void>;
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

  // Sisipkan token Bearer pada tiap permintaan (identitas utama).
  http.interceptors.request.use((config) => {
    const token = readToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  http.interceptors.response.use(undefined, (error) => {
    const message =
      error.response?.data?.message ??
      "Tidak dapat terhubung ke server. Coba lagi.";
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearToken();
      // Hindari loop bila sudah di halaman login
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.assign("/admin/login");
      }
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
    login: async (username, password) => {
      const session = (
        await http.post<{ data: AdminSession }>("/api/v1/auth/login", {
          username,
          password,
        })
      ).data.data;
      storeToken(session.token);
      return session;
    },
    logout: async () => {
      try {
        await http.post("/api/v1/auth/logout");
      } finally {
        clearToken();
      }
    },
    // Dengan backend asli, identitas dibaca dari JWT httpOnly via /me;
    // sesi lokal hanya cache tampilan
    getSession: () => mockDb.getSession(),
    me: async () => {
      try {
        return (await http.get<{ data: AdminUser }>("/api/v1/auth/me")).data
          .data;
      } catch {
        return null;
      }
    },
    stats: async () =>
      (await http.get<{ data: DashboardStats }>("/api/v1/admin/stats")).data
        .data,
    makanan: collection("makanan"),
    budaya: collection("budaya"),
    bahasa: collection("bahasa"),
    destinasi: collection("destinasi"),
    kedaruratan: collection("kedaruratan"),
    hero: {
      list: async () =>
        (await http.get<{ data: HeroImage[] }>("/api/v1/admin/hero")).data.data,
      create: async (input) =>
        (await http.post<{ data: HeroImage }>("/api/v1/admin/hero", input)).data
          .data,
      reorder: async (ids) => {
        await http.put("/api/v1/admin/hero/reorder", { ids });
      },
      remove: async (id) => {
        await http.delete(`/api/v1/admin/hero/${id}`);
      },
    },
    admins: {
      list: async () =>
        (await http.get<{ data: AdminAccount[] }>("/api/v1/admin/admins")).data
          .data,
      create: async (input) =>
        (await http.post<{ data: AdminAccount }>("/api/v1/admin/admins", input))
          .data.data,
      update: async (id, input) =>
        (
          await http.put<{ data: AdminAccount }>(
            `/api/v1/admin/admins/${id}`,
            input
          )
        ).data.data,
      resetPassword: async (id, password) => {
        await http.put(`/api/v1/admin/admins/${id}/password`, { password });
      },
      remove: async (id) => {
        await http.delete(`/api/v1/admin/admins/${id}`);
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
  me: async () => mockDb.getSession()?.user ?? null,
  stats: () => mockDb.stats(),
  makanan: mockDb.makanan,
  budaya: mockDb.budaya,
  bahasa: mockDb.bahasa,
  destinasi: mockDb.destinasi,
  kedaruratan: mockDb.kedaruratan,
  hero: mockDb.hero,
  admins: mockDb.admins,
  settings: mockDb.settings,
};

export const adminApi: AdminApi = API_URL ? httpApi(API_URL) : mockApi;
export const isMockMode = !API_URL;
