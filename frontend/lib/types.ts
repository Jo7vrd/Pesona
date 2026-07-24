export type KategoriMakanan = "makanan" | "minuman" | "kudapan";

export interface Makanan {
  id: number;
  nama: string;
  kategori: KategoriMakanan;
  deskripsi: string;
  fotoUrl: string;
  isUnggulan: boolean;
  /** Opsional; hanya tautan YouTube yang diterima. */
  videoYoutube?: string | null;
}

export interface Budaya {
  id: number;
  nama: string;
  kategori: string;
  deskripsi: string;
  fotoUrl: string;
  isUnggulan: boolean;
  /** Opsional; hanya tautan YouTube yang diterima. */
  videoYoutube?: string | null;
}

export interface BahasaLokal {
  id: number;
  bahasaIndonesia: string;
  bahasaKei: string;
  catatan?: string;
}

export type JenisDestinasi = "Pantai" | "Snorkeling" | "Gua" | "Pulau";

export interface Destinasi {
  id: number;
  nama: string;
  jenis: JenisDestinasi;
  deskripsi: string;
  /** Koordinat perkiraan, verifikasi di lapangan sebelum produksi. */
  lat: number;
  lng: number;
  fotoUrl: string;
  /** Opsional; hanya tautan YouTube yang diterima. */
  videoYoutube?: string | null;
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
  destinasi: ModuleStats;
}

/** Setelan tingkat-situs yang dikelola admin (mis. video halaman Bahasa Kei). */
export interface SiteSettings {
  /** Tautan YouTube yang di-embed di halaman Bahasa Kei; null bila kosong. */
  bahasaVideo?: string | null;
}
