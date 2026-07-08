import axios from "axios";

import { mockDb } from "@/lib/api/mock-db";
import type { BahasaInput } from "@/lib/schemas/bahasa";
import type { BudayaInput } from "@/lib/schemas/budaya";
import type { MakananInput } from "@/lib/schemas/makanan";
import type {
  AdminSession,
  BahasaLokal,
  Budaya,
  DashboardStats,
  Makanan,
} from "@/lib/types";

/**
 * Kontrak API admin. Ada dua implementasi:
 * - HTTP (axios) ke backend Go saat NEXT_PUBLIC_API_URL di-set (Fase 8)
 * - Mock localStorage untuk pengembangan & demo tanpa backend
 *
 * Komponen TIDAK boleh tahu implementasi mana yang aktif.
 */

export const SESSION_COOKIE = "kk_admin_session";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Collection<T, I> {
  list(): Promise<T[]>;
  create(input: I): Promise<T>;
  update(id: number, input: I): Promise<T>;
  remove(id: number): Promise<void>;
}

export interface AdminApi {
  login(email: string, password: string): Promise<AdminSession>;
  logout(): Promise<void>;
  getSession(): AdminSession | null;
  stats(): Promise<DashboardStats>;
  makanan: Collection<Makanan, MakananInput>;
  budaya: Collection<Budaya, BudayaInput>;
  bahasa: Collection<BahasaLokal, BahasaInput>;
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
    login: async (email, password) =>
      (
        await http.post<{ data: AdminSession }>("/api/v1/auth/login", {
          email,
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
  };
}

const mockApi: AdminApi = {
  login: (email, password) => mockDb.login(email, password),
  logout: () => mockDb.logout(),
  getSession: () => mockDb.getSession(),
  stats: () => mockDb.stats(),
  makanan: mockDb.makanan,
  budaya: mockDb.budaya,
  bahasa: mockDb.bahasa,
};

export const adminApi: AdminApi = API_URL ? httpApi(API_URL) : mockApi;
export const isMockMode = !API_URL;
