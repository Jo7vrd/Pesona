import {
  fallbackBahasa,
  fallbackBudaya,
  fallbackMakanan,
} from "@/lib/content/fallback";
import type {
  AdminSession,
  BahasaLokal,
  Budaya,
  DashboardStats,
  Makanan,
} from "@/lib/types";

/**
 * Adapter mock untuk mode pengembangan (NEXT_PUBLIC_API_URL kosong).
 * Menyimpan data di localStorage dengan seed dari konten fallback dan
 * mensimulasikan perilaku API: latensi, cek duplikat (FR-014), dan sesi
 * 8 jam. Seluruh modul ini digantikan API Go pada Fase 8.
 */

const KEYS = {
  makanan: "kk_mock_makanan",
  budaya: "kk_mock_budaya",
  bahasa: "kk_mock_bahasa",
  session: "kk_mock_session",
} as const;

// Kredensial demo — HANYA berlaku di adapter mock, bukan produksi
const DEMO_EMAIL = "admin@keikecil.id";
const DEMO_PASSWORD = "KeiKecil#2026";

interface Stored<T> {
  items: T[];
  nextId: number;
  updatedAt: string | null;
}

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

function load<T extends { id: number }>(key: string, seed: T[]): Stored<T> {
  const raw = window.localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw) as Stored<T>;
    } catch {
      // data korup — kembali ke seed
    }
  }
  return {
    items: seed,
    nextId: Math.max(...seed.map((s) => s.id)) + 1,
    updatedAt: null,
  };
}

function save<T>(key: string, data: Stored<T>) {
  window.localStorage.setItem(key, JSON.stringify(data));
}

function makeCollection<
  T extends { id: number },
  I extends Record<string, unknown>,
>(key: string, seed: T[], uniqueField: keyof I & keyof T) {
  return {
    async list(): Promise<T[]> {
      await delay(200);
      return load(key, seed).items;
    },
    async create(input: I): Promise<T> {
      await delay();
      const db = load(key, seed);
      const value = String(input[uniqueField]).toLowerCase();
      if (
        db.items.some((it) => String(it[uniqueField]).toLowerCase() === value)
      ) {
        throw new Error(
          `"${String(input[uniqueField])}" sudah terdaftar. Gunakan nama lain.`
        );
      }
      const item = { ...input, id: db.nextId } as unknown as T;
      db.items = [item, ...db.items];
      db.nextId += 1;
      db.updatedAt = new Date().toISOString();
      save(key, db);
      return item;
    },
    async update(id: number, input: I): Promise<T> {
      await delay();
      const db = load(key, seed);
      const value = String(input[uniqueField]).toLowerCase();
      if (
        db.items.some(
          (it) =>
            it.id !== id && String(it[uniqueField]).toLowerCase() === value
        )
      ) {
        throw new Error(
          `"${String(input[uniqueField])}" sudah terdaftar. Gunakan nama lain.`
        );
      }
      const index = db.items.findIndex((it) => it.id === id);
      if (index === -1) throw new Error("Data tidak ditemukan.");
      const item = { ...db.items[index], ...input, id } as T;
      db.items[index] = item;
      db.updatedAt = new Date().toISOString();
      save(key, db);
      return item;
    },
    async remove(id: number): Promise<void> {
      await delay();
      const db = load(key, seed);
      db.items = db.items.filter((it) => it.id !== id);
      db.updatedAt = new Date().toISOString();
      save(key, db);
    },
    stats(): { total: number; terakhirDiperbarui: string | null } {
      const db = load(key, seed);
      return { total: db.items.length, terakhirDiperbarui: db.updatedAt };
    },
  };
}

export const mockDb = {
  makanan: makeCollection<Makanan, Omit<Makanan, "id">>(
    KEYS.makanan,
    fallbackMakanan,
    "nama"
  ),
  budaya: makeCollection<Budaya, Omit<Budaya, "id">>(
    KEYS.budaya,
    fallbackBudaya,
    "nama"
  ),
  bahasa: makeCollection<BahasaLokal, Omit<BahasaLokal, "id">>(
    KEYS.bahasa,
    fallbackBahasa,
    "bahasaIndonesia"
  ),

  async login(email: string, password: string): Promise<AdminSession> {
    await delay(500);
    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new Error("Email atau kata sandi salah.");
    }
    const session: AdminSession = {
      token: `mock-${Date.now()}`,
      user: { id: 1, nama: "Admin Desa", email, role: "super_admin" },
    };
    window.localStorage.setItem(KEYS.session, JSON.stringify(session));
    return session;
  },

  getSession(): AdminSession | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(KEYS.session);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminSession;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await delay(150);
    window.localStorage.removeItem(KEYS.session);
  },

  async stats(): Promise<DashboardStats> {
    await delay(250);
    return {
      makanan: this.makanan.stats(),
      budaya: this.budaya.stats(),
      bahasa: this.bahasa.stats(),
    };
  },
};
