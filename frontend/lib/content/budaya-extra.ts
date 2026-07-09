/**
 * Pengayaan statis halaman detail budaya, dikunci per nama entri.
 * Konten hukum adat WAJIB divalidasi tetua adat / penutur asli
 * sebelum produksi, transliterasi bahasa Kei bervariasi antarsumber.
 */

export interface PasalAdat {
  nomor: number;
  kei: string;
  arti: string;
  kelompok: string;
}

export interface BudayaExtra {
  judul: string;
  pengantar: string;
  pasal: PasalAdat[];
  catatan?: string;
}

export const budayaExtra: Record<string, BudayaExtra> = {
  "larvul ngabal": {
    judul: "Tujuh Pasal Larvul Ngabal",
    pengantar:
      "Ketujuh pasal terbagi dalam tiga kelompok: Nevnev menjaga kehidupan, Hanilit menjaga kesusilaan, dan Hawear Balwirin menjaga keadilan atas hak milik.",
    pasal: [
      {
        nomor: 1,
        kei: "Uud entauk na atvunad",
        arti: "Kepala kami bertumpu pada tengkuk kami, hormat dan taat kepada pemimpin serta orang tua.",
        kelompok: "Nevnev",
      },
      {
        nomor: 2,
        kei: "Lelad ain fo mahiling",
        arti: "Leher kami dijunjung tinggi, kehidupan dan jiwa manusia itu mulia, tidak boleh direndahkan.",
        kelompok: "Nevnev",
      },
      {
        nomor: 3,
        kei: "Ul nit envil atumud",
        arti: "Kulit membungkus tubuh kami, martabat tubuh setiap orang wajib dijaga dari penganiayaan.",
        kelompok: "Nevnev",
      },
      {
        nomor: 4,
        kei: "Lar nakmot na ivud",
        arti: "Darah tersimpan dalam tubuh kami, dilarang menumpahkan darah sesama manusia.",
        kelompok: "Nevnev",
      },
      {
        nomor: 5,
        kei: "Rek fo kelmutun",
        arti: "Ambang pintu kamar harus dihormati, kesucian rumah tangga tidak boleh dilanggar.",
        kelompok: "Hanilit",
      },
      {
        nomor: 6,
        kei: "Morjain fo mahiling",
        arti: "Tempat tidur perempuan dimuliakan, kehormatan perempuan wajib dilindungi.",
        kelompok: "Hanilit",
      },
      {
        nomor: 7,
        kei: "Hira i ni fo i ni, it did fo it did",
        arti: "Milik orang lain tetap miliknya, milik kita tetap milik kita, dilarang mengambil hak orang lain.",
        kelompok: "Hawear Balwirin",
      },
    ],
    catatan:
      "Transliterasi dan tafsir pasal dapat berbeda antar-ohoi. Naskah ini disusun dari sumber umum dan menunggu validasi tetua adat setempat.",
  },
};

export function getBudayaExtra(nama: string): BudayaExtra | undefined {
  return budayaExtra[nama.trim().toLowerCase()];
}
