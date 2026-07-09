export interface Spot {
  id: number;
  nama: string;
  jenis: "Pantai" | "Snorkeling" | "Gua" | "Pulau";
  deskripsi: string;
  /** Koordinat perkiraan — verifikasi di lapangan sebelum produksi. */
  lat: number;
  lng: number;
  /** Foto placeholder Unsplash — diganti aset desa via admin. */
  fotoUrl: string;
}

export const spots: Spot[] = [
  {
    id: 1,
    nama: "Pantai Ngurbloat (Pasir Panjang)",
    fotoUrl:
      "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1600&q=80",
    jenis: "Pantai",
    deskripsi:
      "Tiga kilometer pasir putih sehalus tepung — kerap disebut pasir terhalus di Asia. Landai dan aman untuk berenang keluarga.",
    lat: -5.66,
    lng: 132.641,
  },
  {
    id: 2,
    nama: "Pantai Ohoidertawun",
    fotoUrl:
      "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=1600&q=80",
    jenis: "Pantai",
    deskripsi:
      "Saat meti, air surut hingga ratusan meter dan membuka hamparan pasir luas. Tempat terbaik menikmati matahari terbenam.",
    lat: -5.624,
    lng: 132.712,
  },
  {
    id: 3,
    nama: "Goa Hawang",
    fotoUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80",
    jenis: "Gua",
    deskripsi:
      "Gua dengan kolam air payau sebening kristal berwarna biru kehijauan. Berenang di sini terasa seperti di akuarium alami.",
    lat: -5.741,
    lng: 132.67,
  },
  {
    id: 4,
    nama: "Ngurtavur",
    fotoUrl:
      "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=1600&q=80",
    jenis: "Snorkeling",
    deskripsi:
      "Pasir timbul sepanjang dua kilometer yang muncul saat surut, tempat singgah burung pelikan. Terumbu karang di sekitarnya masih perawan.",
    lat: -5.834,
    lng: 132.51,
  },
  {
    id: 5,
    nama: "Pulau Bair",
    fotoUrl:
      "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1600&q=80",
    jenis: "Pulau",
    deskripsi:
      "Laguna tersembunyi di antara tebing karst — sering dijuluki Raja Ampat kecil. Perairan tenang dengan visibilitas snorkeling luar biasa.",
    lat: -5.405,
    lng: 132.686,
  },
];
