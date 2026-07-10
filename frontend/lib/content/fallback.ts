import type { BahasaLokal, Budaya, Makanan } from "@/lib/types";

/**
 * Data fallback (BR-002): dipakai saat API belum tersedia atau konten
 * kosong. Foto Unsplash adalah placeholder pengembangan, diganti aset
 * R2 milik desa saat backend live (Fase 8).
 *
 * PENTING: seluruh isi (nama, deskripsi, kosakata Kei) wajib divalidasi
 * perangkat desa dan penutur asli sebelum produksi.
 */

export const fallbackMakanan: Makanan[] = [
  {
    id: 1,
    nama: "Embal Goreng",
    kategori: "kudapan",
    deskripsi:
      "Olahan singkong khas Kepulauan Kei yang dikeringkan lalu digoreng, renyah di luar, gurih di dalam, teman minum kopi sore. Embal adalah makanan pokok masyarakat Kei yang tahan disimpan berbulan-bulan.",
    fotoUrl:
      "/images/u/1512058564366-18510be2db19.jpg",
    isUnggulan: true,
  },
  {
    id: 2,
    nama: "Ikan Bakar Kei",
    kategori: "makanan",
    deskripsi:
      "Ikan karang segar hasil tangkapan hari itu, dibakar dengan bumbu rica khas Maluku dan disajikan bersama embal. Nelayan Kei hanya mengambil secukupnya, kesegaran adalah bumbu utamanya.",
    fotoUrl:
      "/images/u/1559847844-5315695dadae.jpg",
    isUnggulan: true,
  },
  {
    id: 3,
    nama: "Kohu-Kohu",
    kategori: "makanan",
    deskripsi:
      "Salad khas Maluku dari kelapa parut, ikan teri, dan sayuran segar dengan perasan jeruk, segar dan kaya rempah. Biasa disantap bersama embal atau kasbi rebus.",
    fotoUrl:
      "/images/u/1504674900247-0877df9cc836.jpg",
    isUnggulan: true,
  },
  {
    id: 4,
    nama: "Lad",
    kategori: "makanan",
    deskripsi:
      "Salad rumput laut segar dari perairan Kei, dibumbui kelapa parut dan cabai, hidangan pesisir yang hanya ada di sini. Rumput laut dipanen dari perairan dangkal saat meti.",
    fotoUrl:
      "/images/u/1414235077428-338989a2e8c0.jpg",
    isUnggulan: true,
  },
  {
    id: 5,
    nama: "Ikan Kuah Asam",
    kategori: "makanan",
    deskripsi:
      "Sup ikan berkuah bening asam segar dengan belimbing wuluh dan kemangi. Hidangan rumahan Kei yang menghangatkan setelah seharian di laut.",
    fotoUrl:
      "/images/u/1547592166-23ac45744acd.jpg",
    isUnggulan: false,
  },
  {
    id: 6,
    nama: "Embal Bunga",
    kategori: "kudapan",
    deskripsi:
      "Embal yang dicetak berbentuk bunga lalu dipanggang, sering disebut embal love. Kudapan manis-gurih yang jadi oleh-oleh khas dari Kei.",
    fotoUrl:
      "/images/u/1587314168485-3236d6710814.jpg",
    isUnggulan: false,
  },
  {
    id: 7,
    nama: "Air Guraka",
    kategori: "minuman",
    deskripsi:
      "Minuman jahe hangat dengan gula aren dan taburan kenari, diwariskan lintas generasi di Maluku. Teman terbaik menikmati angin laut sore hari.",
    fotoUrl:
      "/images/u/1544787219-7f47ccb76574.jpg",
    isUnggulan: false,
  },
  {
    id: 8,
    nama: "Jus Pala",
    kategori: "minuman",
    deskripsi:
      "Jus segar dari daging buah pala, kekayaan rempah Maluku dalam segelas minuman. Manis, sedikit sepat, dan sangat menyegarkan di siang hari.",
    fotoUrl:
      "/images/u/1553530666-ba11a7da3888.jpg",
    isUnggulan: false,
  },
];

export const fallbackBudaya: Budaya[] = [
  {
    id: 1,
    nama: "Sasi Laut",
    kategori: "Tradisi konservasi",
    deskripsi:
      "Larangan adat memanen hasil laut pada waktu dan wilayah tertentu. Sasi menjaga terumbu karang dan populasi ikan Kei tetap lestari selama ratusan tahun, kearifan lokal yang kini diakui sebagai praktik konservasi modern. Pelanggaran sasi diselesaikan lewat musyawarah adat.",
    fotoUrl:
      "/images/u/1544551763-46a013bb70d5.jpg",
    isUnggulan: true,
  },
  {
    id: 2,
    nama: "Larvul Ngabal",
    kategori: "Hukum adat",
    deskripsi:
      "Hukum adat tertua Kepulauan Kei, 'darah merah dan tombak dari Bali', yang mengatur harmoni sosial, penghormatan pada sesama, dan hak atas tanah. Masih menjadi pegangan hidup masyarakat Kei hingga hari ini.",
    fotoUrl:
      "/images/u/1541417904950-b855846fe074.jpg",
    isUnggulan: true,
  },
  {
    id: 3,
    nama: "Festival Meti Kei",
    kategori: "Festival",
    deskripsi:
      "Pesta rakyat tahunan menyambut meti, surutnya air laut ekstrem yang membuka hamparan pasir luas. Warga menangkap ikan bersama, menggelar bazar kuliner, dan menampilkan seni tradisi di atas laut yang surut.",
    fotoUrl:
      "/images/u/1533900298318-6b8da08a523e.jpg",
    isUnggulan: false,
  },
  {
    id: 4,
    nama: "Ohoi",
    kategori: "Tatanan adat",
    deskripsi:
      "Kampung adat Kei dengan struktur pemerintahan tradisionalnya sendiri. Setiap ohoi memiliki hak ulayat, kepala adat, dan aturan yang hidup berdampingan dengan pemerintahan desa modern.",
    fotoUrl:
      "/images/u/1537956965359-7573183d1f57.jpg",
    isUnggulan: false,
  },
  {
    id: 5,
    nama: "Anyaman Daun Kelapa",
    kategori: "Kerajinan",
    deskripsi:
      "Keterampilan menganyam daun kelapa menjadi tikar, bakul, dan atap, pengetahuan sehari-hari yang diwariskan dari nenek ke cucu di setiap ohoi pesisir.",
    fotoUrl:
      "/images/u/1590523741831-ab7e8b8f9c7f.jpg",
    isUnggulan: false,
  },
];

export const fallbackBahasa: BahasaLokal[] = [
  { id: 1, bahasaIndonesia: "Pulau", bahasaKei: "Nuhu" },
  { id: 2, bahasaIndonesia: "Laut", bahasaKei: "Roa" },
  { id: 3, bahasaIndonesia: "Ikan", bahasaKei: "Vu'ut" },
  { id: 4, bahasaIndonesia: "Ayam", bahasaKei: "Manut" },
  { id: 5, bahasaIndonesia: "Telur", bahasaKei: "Tilur" },
  { id: 6, bahasaIndonesia: "Darah", bahasaKei: "Lar" },
  { id: 7, bahasaIndonesia: "Merah", bahasaKei: "Vul" },
  { id: 8, bahasaIndonesia: "Tombak", bahasaKei: "Ngab" },
  {
    id: 9,
    bahasaIndonesia: "Air surut (meti)",
    bahasaKei: "Met",
    catatan: "Fenomena surut ekstrem yang dirayakan dalam Festival Meti Kei",
  },
  {
    id: 10,
    bahasaIndonesia: "Kampung",
    bahasaKei: "Ohoi",
  },
  {
    id: 11,
    bahasaIndonesia: "Kepulauan Kei",
    bahasaKei: "Nuhu Evav",
    catatan: "Evav adalah sebutan orang Kei untuk tanah kelahirannya",
  },
  {
    id: 12,
    bahasaIndonesia: "Satu untuk semua, semua untuk satu",
    bahasaKei: "Ain ni ain",
    catatan: "Semboyan persaudaraan masyarakat Kei",
  },
];
