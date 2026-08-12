import { idCopy } from "@/lib/i18n";

/**
 * Registry teks beranda yang bisa diedit admin (Bahasa Indonesia).
 * `key` dipakai baik oleh form admin maupun komponen tampilan lewat
 * useCopy(key, default). `default` = teks bawaan i18n (Indonesia).
 */
export interface BerandaField {
  key: string;
  label: string;
  default: string;
  multiline?: boolean;
}

export interface BerandaGroup {
  title: string;
  fields: BerandaField[];
}

// Eyebrow hero di-hardcode di komponen (bukan di i18n), jadi default-nya
// ditulis eksplisit di sini agar tetap bisa diedit.
const HERO_EYEBROW_DEFAULT = "Maluku Tenggara, Indonesia";

export const BERANDA_GROUPS: BerandaGroup[] = [
  {
    title: "Hero (bagian paling atas)",
    fields: [
      { key: "hero_eyebrow", label: "Teks kecil di atas judul", default: HERO_EYEBROW_DEFAULT },
      { key: "hero_title", label: "Judul besar", default: idCopy.hero.title },
      { key: "hero_lede", label: "Deskripsi", default: idCopy.hero.lede, multiline: true },
      { key: "hero_cta", label: "Tombol ajakan", default: idCopy.hero.cta },
    ],
  },
  {
    title: "Sambutan",
    fields: [
      { key: "welcome_eyebrow", label: "Teks kecil", default: idCopy.landing.welcomeEyebrow },
      { key: "welcome_title", label: "Judul", default: idCopy.landing.welcomeTitle },
      { key: "welcome_body", label: "Paragraf", default: idCopy.landing.welcomeBody, multiline: true },
    ],
  },
  {
    title: "Seksi Kuliner",
    fields: [
      { key: "kuliner_eyebrow", label: "Teks kecil", default: idCopy.landing.kulinerEyebrow },
      { key: "kuliner_title", label: "Judul", default: idCopy.landing.kulinerTitle },
    ],
  },
  {
    title: "Seksi Budaya",
    fields: [
      { key: "budaya_eyebrow", label: "Teks kecil", default: idCopy.landing.budayaEyebrow },
      { key: "budaya_title", label: "Judul", default: idCopy.landing.budayaTitle },
    ],
  },
  {
    title: "Banner ajakan (4 kartu)",
    fields: idCopy.banners.flatMap((b, i) => [
      { key: `banner_${i}_title`, label: `Banner ${i + 1} — Judul (${b.cta})`, default: b.title },
      { key: `banner_${i}_cta`, label: `Banner ${i + 1} — Tombol`, default: b.cta },
    ]),
  },
  {
    title: "Teks berjalan (marquee)",
    fields: idCopy.marquee.map((m, i) => ({
      key: `marquee_${i}`,
      label: `Baris ${i + 1}`,
      default: m,
    })),
  },
];

/** Semua field dalam satu larik (untuk seed & validasi). */
export const BERANDA_FIELDS: BerandaField[] = BERANDA_GROUPS.flatMap(
  (g) => g.fields
);
