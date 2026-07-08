export interface Spot {
  id: number;
  nama: string;
  jenis: "Pantai" | "Snorkeling" | "Gua" | "Pulau";
  deskripsi: string;
  /** Koordinat perkiraan — verifikasi di lapangan sebelum produksi. */
  lat: number;
  lng: number;
}

export const spots: Spot[] = [
  {
    id: 1,
    nama: "Pantai Ngurbloat (Pasir Panjang)",
    jenis: "Pantai",
    deskripsi:
      "Tiga kilometer pasir putih sehalus tepung — kerap disebut pasir terhalus di Asia. Landai dan aman untuk berenang keluarga.",
    lat: -5.66,
    lng: 132.641,
  },
  {
    id: 2,
    nama: "Pantai Ohoidertawun",
    jenis: "Pantai",
    deskripsi:
      "Saat meti, air surut hingga ratusan meter dan membuka hamparan pasir luas. Tempat terbaik menikmati matahari terbenam.",
    lat: -5.624,
    lng: 132.712,
  },
  {
    id: 3,
    nama: "Goa Hawang",
    jenis: "Gua",
    deskripsi:
      "Gua dengan kolam air payau sebening kristal berwarna biru kehijauan. Berenang di sini terasa seperti di akuarium alami.",
    lat: -5.741,
    lng: 132.67,
  },
  {
    id: 4,
    nama: "Ngurtavur",
    jenis: "Snorkeling",
    deskripsi:
      "Pasir timbul sepanjang dua kilometer yang muncul saat surut, tempat singgah burung pelikan. Terumbu karang di sekitarnya masih perawan.",
    lat: -5.834,
    lng: 132.51,
  },
  {
    id: 5,
    nama: "Pulau Bair",
    jenis: "Pulau",
    deskripsi:
      "Laguna tersembunyi di antara tebing karst — sering dijuluki Raja Ampat kecil. Perairan tenang dengan visibilitas snorkeling luar biasa.",
    lat: -5.405,
    lng: 132.686,
  },
];
