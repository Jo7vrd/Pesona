/** Blok bertajuk opsional di bawah deskripsi konten (mis. pasal adat). */
export interface Subsection {
  judul: string;
  isi: string;
  /** Foto sisipan opsional untuk blok ini. */
  foto?: string;
  /** Titik pandang foto (object-position). Default tengah. */
  fotoPosisi?: string;
  /** Skala/zoom foto (1–3). Default 1. */
  fotoZoom?: number;
}

export type KategoriMakanan = "makanan" | "minuman" | "kudapan";

export interface Makanan {
  id: number;
  nama: string;
  kategori: KategoriMakanan;
  deskripsi: string;
  fotoUrl: string;
  /** Titik pandang foto (CSS object-position, mis. "50% 30%"). Default tengah. */
  fotoPosisi?: string;
  /** Skala/zoom foto (1–3). Default 1. */
  fotoZoom?: number;
  isUnggulan: boolean;
  /** Opsional; hanya tautan YouTube yang diterima. */
  videoYoutube?: string | null;
  /** Sub-bagian bertajuk opsional di bawah deskripsi. */
  subsections?: Subsection[];
}

export interface Budaya {
  id: number;
  nama: string;
  kategori: string;
  deskripsi: string;
  fotoUrl: string;
  /** Titik pandang foto (CSS object-position, mis. "50% 30%"). Default tengah. */
  fotoPosisi?: string;
  /** Skala/zoom foto (1–3). Default 1. */
  fotoZoom?: number;
  isUnggulan: boolean;
  /** Opsional; hanya tautan YouTube yang diterima. */
  videoYoutube?: string | null;
  /** Sub-bagian bertajuk opsional di bawah deskripsi. */
  subsections?: Subsection[];
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
  /** Titik pandang foto (CSS object-position, mis. "50% 30%"). Default tengah. */
  fotoPosisi?: string;
  /** Skala/zoom foto (1–3). Default 1. */
  fotoZoom?: number;
  /** Opsional; hanya tautan YouTube yang diterima. */
  videoYoutube?: string | null;
  /** Sub-bagian bertajuk opsional di bawah deskripsi. */
  subsections?: Subsection[];
}

export type AdminRole = "super_admin" | "admin";

export interface AdminUser {
  id: number;
  nama: string;
  username: string;
  role: AdminRole;
}

/** Satu foto latar carousel hero beranda (dikelola admin). */
export interface HeroImage {
  id: number;
  fotoUrl: string;
  /** Titik pandang foto (CSS object-position, mis. "50% 30%"). Default tengah. */
  fotoPosisi?: string;
  /** Skala/zoom foto (1–3). Default 1. */
  fotoZoom?: number;
  urutan: number;
}

/** Kontak darurat di halaman Kedaruratan (dikelola admin). */
export interface EmergencyContact {
  id: number;
  nama: string;
  peran: string;
  telepon: string;
  /** Kunci ikon: phone | anchor | ambulance | shield | waves | hospital. */
  ikon: string;
  urutan: number;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
}

/** Akun admin yang dikelola super admin di panel "Akun Admin". */
export interface AdminAccount {
  id: number;
  nama: string;
  username: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
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
  /** URL foto peta terumbu karang di halaman Peta; null bila kosong. */
  petaKarangFoto?: string | null;
  /** Deskripsi/keterangan peta terumbu karang; null bila kosong. */
  petaKarangDeskripsi?: string | null;
  /** Foto hero per halaman modul: slug → URL (null/kosong = pakai bawaan). */
  heroImages?: Record<string, string | null>;
  /** Titik pandang foto hero per halaman: slug → object-position ("x% y%"). */
  heroImagePos?: Record<string, string>;
  /** Skala/zoom foto hero per halaman: slug → angka (1–3). */
  heroImageZoom?: Record<string, number>;
  /** Teks beranda editable: field → bahasa (id/en/zh) → teks. */
  berandaTeks?: Record<string, Record<string, string>>;
}
