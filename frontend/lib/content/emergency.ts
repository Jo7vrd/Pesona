import {
  Ambulance,
  Anchor,
  Phone,
  Shield,
  type LucideIcon,
} from "lucide-react";

export interface EmergencyContact {
  nama: string;
  peran: string;
  telepon: string;
  icon: LucideIcon;
}

/**
 * Konten statis sesuai BR-004, tidak dikelola lewat admin.
 * Nomor nasional resmi; nomor lokal (puskesmas, pos SAR terdekat)
 * dilengkapi perangkat desa sebelum produksi.
 */
export const emergencyContacts: EmergencyContact[] = [
  {
    nama: "Nomor Darurat Nasional",
    peran: "Semua jenis kedaruratan",
    telepon: "112",
    icon: Phone,
  },
  {
    nama: "Basarnas",
    peran: "Pencarian & pertolongan di laut",
    telepon: "115",
    icon: Anchor,
  },
  {
    nama: "Ambulans",
    peran: "Kedaruratan medis",
    telepon: "119",
    icon: Ambulance,
  },
  {
    nama: "Polisi",
    peran: "Keamanan & ketertiban",
    telepon: "110",
    icon: Shield,
  },
];

export interface P3KGuide {
  id: string;
  judul: string;
  langkah: string[];
  peringatan?: string;
}

export const p3kGuides: P3KGuide[] = [
  {
    id: "ubur-ubur",
    judul: "Tersengat ubur-ubur",
    langkah: [
      "Segera keluar dari air dengan tenang.",
      "Bilas area sengatan dengan cuka selama minimal 30 detik. Jangan gunakan air tawar, memicu pelepasan racun lebih banyak.",
      "Angkat sisa tentakel dengan pinset atau tepi benda kaku, bukan dengan jari telanjang.",
      "Rendam area sengatan dalam air hangat (sekitar 45°C) selama 20–45 menit untuk meredakan nyeri.",
    ],
    peringatan:
      "Segera hubungi 119 bila muncul sesak napas, nyeri dada, atau pembengkakan wajah.",
  },
  {
    id: "bulu-babi",
    judul: "Tertusuk bulu babi",
    langkah: [
      "Rendam bagian yang tertusuk dalam air hangat 30–90 menit untuk meredakan nyeri dan melunakkan duri.",
      "Cabut duri yang terlihat dengan pinset secara perlahan. Jangan menekan atau memecahkan duri di dalam kulit.",
      "Bersihkan luka dengan air bersih dan sabun, lalu oleskan antiseptik.",
      "Pantau beberapa hari ke depan, duri yang tertinggal dapat menyebabkan infeksi.",
    ],
    peringatan:
      "Cari bantuan medis bila duri menancap dalam, dekat sendi, atau timbul tanda infeksi.",
  },
  {
    id: "luka-karang",
    judul: "Luka gores karang",
    langkah: [
      "Bilas luka dengan air bersih mengalir sesegera mungkin.",
      "Bersihkan dengan sabun untuk mengangkat serpihan karang dan mikroorganisme.",
      "Oleskan antiseptik dan tutup dengan perban bersih.",
      "Ganti perban setiap hari dan biarkan luka bernapas saat kering.",
    ],
    peringatan:
      "Luka karang mudah terinfeksi. Bila memerah, bernanah, atau demam, segera ke fasilitas kesehatan.",
  },
  {
    id: "sengatan-matahari",
    judul: "Sengatan matahari & dehidrasi",
    langkah: [
      "Pindah ke tempat teduh dan hentikan aktivitas.",
      "Minum air putih atau larutan elektrolit sedikit demi sedikit.",
      "Kompres dingin pada kulit yang memerah; jangan pecahkan lepuhan.",
      "Kenakan pakaian longgar dan hindari matahari hingga pulih.",
    ],
    peringatan:
      "Kulit kering-panas, kebingungan, atau pingsan adalah tanda heat stroke, hubungi 112 segera.",
  },
  {
    id: "kram",
    judul: "Kram saat berenang",
    langkah: [
      "Tetap tenang, panik menguras tenaga lebih cepat daripada kram itu sendiri.",
      "Ambil posisi terlentang mengapung dan tarik napas dalam.",
      "Regangkan otot yang kram perlahan (tarik ujung kaki ke arah tubuh untuk kram betis).",
      "Setelah mereda, berenang perlahan ke tepi dengan gaya yang tidak membebani otot tersebut.",
    ],
  },
  {
    id: "arus",
    judul: "Terseret arus (rip current)",
    langkah: [
      "Jangan melawan arus dengan berenang lurus ke pantai, Anda akan kalah tenaga.",
      "Berenang menyamping, sejajar garis pantai, sampai keluar dari jalur arus.",
      "Bila lelah, mengapung terlentang dan lambaikan satu tangan sebagai tanda minta tolong.",
      "Setelah bebas dari arus, berenang menyerong menuju pantai.",
    ],
    peringatan:
      "Sebelum berenang, tanyakan titik arus kuat kepada warga, mereka yang paling tahu perairan ini.",
  },
];
