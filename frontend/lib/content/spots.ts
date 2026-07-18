import type { Destinasi } from "@/lib/types";

/**
 * Data fallback destinasi (BR-002) — dipakai saat backend belum live,
 * sebagai seed mock admin, dan oleh halaman peta. Ngurbloat membawa
 * contoh tautan video YouTube; ganti dengan video resmi desa via admin.
 */
export const fallbackDestinasi: Destinasi[] = [
  {
    id: 1,
    nama: "Pantai Ngurbloat (Pasir Panjang)",
    fotoUrl: "/images/u/1590523741831-ab7e8b8f9c7f.jpg",
    jenis: "Pantai",
    deskripsi:
      "Tiga kilometer pasir putih sehalus tepung, kerap disebut pasir terhalus di Asia. Landai dan aman untuk berenang keluarga.",
    lat: -5.66,
    lng: 132.641,
    videoYoutube: "https://www.youtube.com/watch?v=C6RADZ_om4k",
  },
  {
    id: 2,
    nama: "Pantai Ohoidertawun",
    fotoUrl: "/images/u/1476673160081-cf065607f449.jpg",
    jenis: "Pantai",
    deskripsi:
      "Saat meti, air surut hingga ratusan meter dan membuka hamparan pasir luas. Tempat terbaik menikmati matahari terbenam.",
    lat: -5.624,
    lng: 132.712,
  },
  {
    id: 3,
    nama: "Goa Hawang",
    fotoUrl: "/images/u/1544551763-46a013bb70d5.jpg",
    jenis: "Gua",
    deskripsi:
      "Gua dengan kolam air payau sebening kristal berwarna biru kehijauan. Berenang di sini terasa seperti di akuarium alami.",
    lat: -5.741,
    lng: 132.67,
  },
  {
    id: 4,
    nama: "Ngurtavur",
    fotoUrl: "/images/u/1541417904950-b855846fe074.jpg",
    jenis: "Snorkeling",
    deskripsi:
      "Pasir timbul sepanjang dua kilometer yang muncul saat surut, tempat singgah burung pelikan. Terumbu karang di sekitarnya masih perawan.",
    lat: -5.834,
    lng: 132.51,
  },
  {
    id: 5,
    nama: "Pantai Perwira",
    fotoUrl: "/images/pantai-perwira.jpg",
    jenis: "Pantai",
    deskripsi:
      "Pasir putih yang diapit karang dan hutan pantai yang rimbun. Debur ombaknya memecah di batu karang, spot favorit menikmati senja dalam ketenangan.",
    lat: -5.62,
    lng: 132.655,
  },
  {
    id: 6,
    nama: "Pulau Bair",
    fotoUrl: "/images/u/1559128010-7c1ad6e1b6a5.jpg",
    jenis: "Pulau",
    deskripsi:
      "Laguna tersembunyi di antara tebing karst, sering dijuluki Raja Ampat kecil. Perairan tenang dengan visibilitas snorkeling luar biasa.",
    lat: -5.405,
    lng: 132.686,
  },
];

/** Alias lama; beberapa halaman masih mengimpor nama ini. */
export type Spot = Destinasi;
export const spots = fallbackDestinasi;
