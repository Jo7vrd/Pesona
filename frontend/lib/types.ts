export type KategoriMakanan = "makanan" | "minuman" | "kudapan";

export interface Makanan {
  id: number;
  nama: string;
  kategori: KategoriMakanan;
  deskripsi: string;
  fotoUrl: string;
  isUnggulan: boolean;
}

export interface Budaya {
  id: number;
  nama: string;
  kategori: string;
  deskripsi: string;
  fotoUrl: string;
  isUnggulan: boolean;
}

export interface BahasaLokal {
  id: number;
  bahasaIndonesia: string;
  bahasaKei: string;
  catatan?: string;
}

export type AdminRole = "super_admin" | "admin";

export interface AdminUser {
  id: number;
  nama: string;
  email: string;
  role: AdminRole;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
}

export interface ModuleStats {
  total: number;
  terakhirDiperbarui: string | null;
}

export interface DashboardStats {
  makanan: ModuleStats;
  budaya: ModuleStats;
  bahasa: ModuleStats;
}
