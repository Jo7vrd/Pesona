export const siteConfig = {
  name: "Jelajah Kei Kecil",
  shortName: "Kei Kecil",
  description:
    "Portal resmi pariwisata Desa Kei Kecil, Maluku Tenggara. Jelajahi kuliner khas, budaya, terumbu karang, bahasa Kei, dan informasi keselamatan pesisir.",
  desa: {
    nama: "Desa Kei Kecil",
    kabupaten: "Kabupaten Maluku Tenggara",
    provinsi: "Maluku",
    alamat: "Kepulauan Kei Kecil, Maluku Tenggara, Maluku, Indonesia",
    email: "kknkeikecil.ugm@gmail.com",
  },
} as const;

export const navItems = [
  { label: "Beranda", href: "/" },
  { label: "Destinasi", href: "/destinasi" },
  { label: "Kuliner", href: "/makanan" },
  { label: "Budaya", href: "/budaya" },
  { label: "Peta", href: "/peta" },
  { label: "Bahasa Kei", href: "/bahasa" },
  { label: "Kedaruratan", href: "/kedaruratan" },
] as const;
