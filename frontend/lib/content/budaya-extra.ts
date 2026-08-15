/**
 * Pengayaan statis halaman detail budaya, dikunci per nama entri.
 * Konten hukum adat WAJIB divalidasi tetua adat / penutur asli
 * sebelum produksi; transliterasi bahasa Kei bervariasi antarsumber.
 */

export interface Tr {
  en: string;
  zh: string;
}

export interface PasalAdat {
  nomor: number;
  /** Bunyi pasal dalam bahasa Kei (tetap di semua bahasa). */
  kei: string;
  arti: string;
  artiTr?: Tr;
  kelompok: string;
  kelompokTr?: Tr;
}

export interface BudayaExtra {
  judul: string;
  judulTr?: Tr;
  pengantar: string;
  pengantarTr?: Tr;
  pasal: PasalAdat[];
  catatan?: string;
  catatanTr?: Tr;
}

export const budayaExtra: Record<string, BudayaExtra> = {
  "larvul ngabal": {
    judul: "Tujuh Pasal Larvul Ngabal",
    judulTr: {
      en: "The Seven Articles of Larvul Ngabal",
      zh: "Larvul Ngabal 七条律法",
    },
    pengantar:
      "Ketujuh pasal terbagi dua: empat pasal hukum pidana (Larvul) yang menjaga kehidupan dan tubuh manusia, serta tiga pasal hukum perdata (Ngabal) yang mengatur kesucian keluarga dan hak milik.",
    pengantarTr: {
      en: "The seven articles fall into two groups: four criminal-law articles (Larvul) that protect human life and the body, and three civil-law articles (Ngabal) that govern family sanctity and property rights.",
      zh: "七条律法分为两组：四条刑法（Larvul）守护人的生命与身体，三条民法（Ngabal）规范家室贞洁与财产权利。",
    },
    pasal: [
      {
        nomor: 1,
        kei: "Uud natauk tavunad",
        arti: "Kepala bertumpu pada pundak — tidak boleh memenggal atau melepaskan kepala seseorang dari tubuhnya.",
        artiTr: {
          en: "The head rests on the shoulders — one must not behead or sever a person's head from their body.",
          zh: "头颅安于肩上——不得砍下或使人首身分离。",
        },
        kelompok: "Pidana",
        kelompokTr: { en: "Criminal", zh: "刑法" },
      },
      {
        nomor: 2,
        kei: "Ul nit nanvil atumud",
        arti: "Kulit membungkus tubuh — tidak boleh melukai kulit seseorang.",
        artiTr: {
          en: "The skin wraps the body — one must not wound a person's skin.",
          zh: "皮肤包裹身体——不得伤及他人肌肤。",
        },
        kelompok: "Pidana",
        kelompokTr: { en: "Criminal", zh: "刑法" },
      },
      {
        nomor: 3,
        kei: "Laar nakmut i vud",
        arti: "Darah yang tersimpan dalam tubuh manusia — tidak boleh menumpahkan darah seseorang.",
        artiTr: {
          en: "The blood held within the human body — one must not shed a person's blood.",
          zh: "血液存于人体之内——不得使人流血。",
        },
        kelompok: "Pidana",
        kelompokTr: { en: "Criminal", zh: "刑法" },
      },
      {
        nomor: 4,
        kei: "Rek fo kelmutun",
        arti: "Tidak boleh sesuka hati melewati batas kamar tidur dan ruang tamu.",
        artiTr: {
          en: "One must not cross at will the bounds of the bedroom and the living room.",
          zh: "不得随意逾越卧室与客厅的界限。",
        },
        kelompok: "Pidana",
        kelompokTr: { en: "Criminal", zh: "刑法" },
      },
      {
        nomor: 5,
        kei: "Moryaib fo mahiling",
        arti: "Keharusan menjaga kesucian kamar keluarga dan seorang gadis.",
        artiTr: {
          en: "The duty to guard the sanctity of the family room and of a young woman.",
          zh: "须守护家室与少女的贞洁。",
        },
        kelompok: "Perdata",
        kelompokTr: { en: "Civil", zh: "民法" },
      },
      {
        nomor: 6,
        kei: "Hira ni natub fo i ni it did natub fo it did",
        arti: "Tidak boleh mengakui kepemilikan orang lain.",
        artiTr: {
          en: "One must not claim another's belongings as one's own.",
          zh: "不得将他人之物据为己有。",
        },
        kelompok: "Perdata",
        kelompokTr: { en: "Civil", zh: "民法" },
      },
      {
        nomor: 7,
        kei: "Hira ni sa natub fo ni sa ni ken natub fo ni ken",
        arti: "Keharusan memberi pengakuan terhadap kesalahan seseorang, serta memutuskan salah dan benar dengan bijak.",
        artiTr: {
          en: "The duty to acknowledge one's wrongdoing, and to judge right and wrong wisely.",
          zh: "须承认自己的过错，并明辨是非、秉公裁断。",
        },
        kelompok: "Perdata",
        kelompokTr: { en: "Civil", zh: "民法" },
      },
    ],
    catatan:
      "Transliterasi dan tafsir pasal dapat berbeda antar-ohoi. Naskah ini disusun dari penuturan masyarakat Ohoi Elaar.",
    catatanTr: {
      en: "Transliteration and interpretation may vary between ohoi. This text is drawn from the accounts of the Ohoi Elaar community.",
      zh: "音译与释义在各 ohoi 之间可能不同。本文根据 Ohoi Elaar 社区的叙述整理。",
    },
  },
};

export function getBudayaExtra(nama: string): BudayaExtra | undefined {
  return budayaExtra[nama.trim().toLowerCase()];
}
