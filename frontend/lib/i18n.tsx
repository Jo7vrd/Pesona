"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * i18n ringan untuk seluruh teks statis situs publik. Konten kelolaan
 * admin (deskripsi kuliner/budaya, kamus, pasal adat) tetap Bahasa
 * Indonesia sampai backend menyimpan terjemahannya per entri.
 */

export type Locale = "id" | "en" | "zh";
const LOCALE_KEY = "kk_locale";
const THEME_KEY = "kk_public_theme";

interface PageCopy {
  eyebrow: string;
  title: string;
  desc: string;
}

const dictionaries = {
  id: {
    nav: {
      "/": "Beranda",
      "/destinasi": "Destinasi",
      "/makanan": "Kuliner",
      "/budaya": "Budaya",
      "/peta": "Peta",
      "/bahasa": "Bahasa Kei",
      "/kedaruratan": "Kedaruratan",
    } as Record<string, string>,
    hero: {
      title: "Surga kecil di timur Indonesia",
      lede: "Pasir sehalus tepung di Ngurbloat, laguna sebening kaca, dan budaya yang dijaga turun-temurun. Selamat datang di Kei Kecil.",
      cta: "Jelajahi Kei!",
    },
    landing: {
      welcomeEyebrow: "Selamat datang",
      welcomeTitle: "Desa kecil, kekayaan yang tak terkira",
      welcomeBody:
        "Kei Kecil adalah rumah bagi pantai berpasir paling halus di dunia, terumbu karang yang dijaga hukum adat Sasi, dan masyarakat yang hidup selaras dengan laut. Situs ini adalah pintu masuk Anda, dari kuliner khas hingga kosakata bahasa Kei untuk menyapa warga.",
      kulinerEyebrow: "Kuliner unggulan",
      kulinerTitle: "Cita rasa dari tanah dan laut Kei",
      lihatSemua: "Lihat semua kuliner",
      budayaEyebrow: "Budaya & tradisi",
      budayaTitle: "Warisan yang menjaga laut tetap hidup",
    },
    marquee: [
      "Pasir terhalus di Asia",
      "Laguna sebening kristal",
      "Ayo jelajahi Kei Kecil",
      "Budaya yang menjaga laut",
      "Senja terindah di timur Indonesia",
      "Surga kecil menanti Anda",
    ],
    banners: [
      { href: "/destinasi", title: "Temukan surga tersembunyi Kei.", cta: "Destinasi" },
      { href: "/makanan", title: "Cicipi cita rasa asli Kei.", cta: "Kuliner" },
      { href: "/budaya", title: "Selami adat yang menjaga laut.", cta: "Budaya" },
      { href: "/bahasa", title: "Belajar bahasa, sapa warga.", cta: "Bahasa Kei" },
    ],
    pages: {
      destinasi: {
        eyebrow: "Destinasi",
        title: "Tempat-tempat yang membuat Kei dikenang",
        desc: "Dari pasir sehalus tepung hingga laguna tersembunyi di balik karst, inilah alasan orang datang jauh-jauh ke ujung timur Indonesia.",
      },
      makanan: {
        eyebrow: "Kuliner",
        title: "Cita rasa dari tanah dan laut Kei",
        desc: "Makanan pokok dari singkong, hasil laut yang diambil secukupnya, dan rempah yang tumbuh di pekarangan, inilah meja makan masyarakat Kei.",
      },
      budaya: {
        eyebrow: "Budaya & tradisi",
        title: "Warisan yang menjaga laut tetap hidup",
        desc: "Di Kei, adat bukan pajangan masa lalu, ia mengatur kapan laut boleh dipanen, bagaimana tamu dihormati, dan bagaimana sengketa diselesaikan.",
      },
      bahasa: {
        eyebrow: "Bahasa Kei",
        title: "Sapa warga dengan bahasanya sendiri",
        desc: "Beberapa kata Kei yang Anda ucapkan akan membuka lebih banyak senyum daripada seribu foto. Mulai dari sini.",
      },
      peta: {
        eyebrow: "Peta karang",
        title: "Temukan titik terbaik di perairan Kei",
        desc: "Pantai, laguna, dan taman karang pilihan beserta koordinatnya. Hormati aturan sasi: bila ada tanda larangan, jangan memanen apa pun.",
      },
      kedaruratan: {
        eyebrow: "Kedaruratan pesisir",
        title: "Tenang, dan ikuti langkahnya",
        desc: "Simpan halaman ini sebelum ke pantai. Kontak penting bisa langsung dihubungi dari ponsel Anda.",
      },
    } as Record<string, PageCopy>,
    common: {
      semua: "Semua",
      makanan: "Makanan",
      minuman: "Minuman",
      kudapan: "Kudapan",
      sajianDitampilkan: "{n} sajian ditampilkan",
      warisanDitampilkan: "{n} warisan budaya ditampilkan",
      kosakataCount: "{a} dari {b} kosakata",
      cariKosakata: "Cari kata, misalnya laut, ikan, kampung…",
      kataBelumAda: "Kata “{q}” belum ada",
      kamusCatatan: "Kamus ini terus dilengkapi oleh warga desa. Coba kata lain.",
      pelajari: "Pelajari lebih lanjut",
    },
    footer: {
      jelajahi: "Jelajahi",
      kontak: "Kontak",
      admin: "Masuk admin",
      desc: "Portal resmi pariwisata Desa Kei Kecil, Maluku Tenggara. Jelajahi kuliner khas, budaya, terumbu karang, bahasa Kei, dan informasi keselamatan pesisir.",
    },
    settings: {
      label: "Pengaturan",
      bahasa: "Bahasa",
      tampilan: "Tampilan",
      terang: "Terang",
      gelap: "Gelap",
    },
  },
  en: {
    nav: {
      "/": "Home",
      "/destinasi": "Destinations",
      "/makanan": "Culinary",
      "/budaya": "Culture",
      "/peta": "Map",
      "/bahasa": "Kei Language",
      "/kedaruratan": "Emergency",
    } as Record<string, string>,
    hero: {
      title: "A little paradise in eastern Indonesia",
      lede: "Flour soft sand at Ngurbloat, crystal clear lagoons, and a culture kept alive for generations. Welcome to Kei Kecil.",
      cta: "Explore Kei!",
    },
    landing: {
      welcomeEyebrow: "Welcome",
      welcomeTitle: "A small village of boundless riches",
      welcomeBody:
        "Kei Kecil is home to the world's softest sand, coral reefs protected by the Sasi customary law, and a community living in harmony with the sea. This site is your gateway, from local cuisine to Kei phrases for greeting the locals.",
      kulinerEyebrow: "Featured cuisine",
      kulinerTitle: "Flavours of Kei's land and sea",
      lihatSemua: "See all cuisine",
      budayaEyebrow: "Culture & tradition",
      budayaTitle: "Heritage that keeps the sea alive",
    },
    marquee: [
      "The softest sand in Asia",
      "Crystal clear lagoons",
      "Come explore Kei Kecil",
      "A culture that guards the sea",
      "Eastern Indonesia's finest sunsets",
      "A little paradise awaits",
    ],
    banners: [
      { href: "/destinasi", title: "Find Kei's hidden paradise.", cta: "Destinations" },
      { href: "/makanan", title: "Taste the true flavours of Kei.", cta: "Culinary" },
      { href: "/budaya", title: "Dive into sea-guarding traditions.", cta: "Culture" },
      { href: "/bahasa", title: "Learn the language, greet the locals.", cta: "Kei Language" },
    ],
    pages: {
      destinasi: {
        eyebrow: "Destinations",
        title: "Places that make Kei unforgettable",
        desc: "From flour soft sand to lagoons hidden behind karst cliffs, this is why people travel to Indonesia's far east.",
      },
      makanan: {
        eyebrow: "Culinary",
        title: "Flavours of Kei's land and sea",
        desc: "Cassava staples, seafood taken only as needed, and spices from the backyard, this is the Kei family table.",
      },
      budaya: {
        eyebrow: "Culture & tradition",
        title: "Heritage that keeps the sea alive",
        desc: "In Kei, custom is no museum piece, it governs when the sea may be harvested, how guests are honoured, and how disputes are settled.",
      },
      bahasa: {
        eyebrow: "Kei Language",
        title: "Greet the locals in their own words",
        desc: "A few Kei words will earn you more smiles than a thousand photos. Start here.",
      },
      peta: {
        eyebrow: "Reef map",
        title: "Find the best spots in Kei waters",
        desc: "Hand-picked beaches, lagoons, and coral gardens with their coordinates. Respect sasi: where a ban sign stands, harvest nothing.",
      },
      kedaruratan: {
        eyebrow: "Coastal emergency",
        title: "Stay calm, follow the steps",
        desc: "Save this page before heading to the beach. Key contacts can be dialled straight from your phone.",
      },
    } as Record<string, PageCopy>,
    common: {
      semua: "All",
      makanan: "Food",
      minuman: "Drinks",
      kudapan: "Snacks",
      sajianDitampilkan: "{n} dishes shown",
      warisanDitampilkan: "{n} heritage entries shown",
      kosakataCount: "{a} of {b} words",
      cariKosakata: "Search a word, e.g. sea, fish, village…",
      kataBelumAda: "“{q}” isn't listed yet",
      kamusCatatan: "Villagers keep expanding this dictionary. Try another word.",
      pelajari: "Learn more",
    },
    footer: {
      jelajahi: "Explore",
      kontak: "Contact",
      admin: "Admin login",
      desc: "The official tourism portal of Kei Kecil, Southeast Maluku. Explore local cuisine, culture, coral reefs, the Kei language, and coastal safety information.",
    },
    settings: {
      label: "Settings",
      bahasa: "Language",
      tampilan: "Appearance",
      terang: "Light",
      gelap: "Dark",
    },
  },
  zh: {
    nav: {
      "/": "首页",
      "/destinasi": "目的地",
      "/makanan": "美食",
      "/budaya": "文化",
      "/peta": "地图",
      "/bahasa": "凯语",
      "/kedaruratan": "紧急信息",
    } as Record<string, string>,
    hero: {
      title: "印尼东部的小天堂",
      lede: "Ngurbloat细腻如面粉的白沙、清澈见底的泻湖，以及世代相传的文化。欢迎来到凯克其尔。",
      cta: "探索凯岛！",
    },
    landing: {
      welcomeEyebrow: "欢迎",
      welcomeTitle: "小村庄，无尽的宝藏",
      welcomeBody:
        "凯克其尔拥有世界上最细腻的沙滩、由Sasi习惯法守护的珊瑚礁，以及与海洋和谐共处的居民。本网站是您的入口，从特色美食到问候当地人的凯语词汇。",
      kulinerEyebrow: "精选美食",
      kulinerTitle: "凯岛山海之味",
      lihatSemua: "查看全部美食",
      budayaEyebrow: "文化与传统",
      budayaTitle: "守护海洋的文化遗产",
    },
    marquee: [
      "亚洲最细腻的沙滩",
      "清澈见底的泻湖",
      "来探索凯克其尔",
      "守护海洋的文化",
      "印尼东部最美的日落",
      "小天堂在等您",
    ],
    banners: [
      { href: "/destinasi", title: "发现凯岛隐秘天堂。", cta: "目的地" },
      { href: "/makanan", title: "品尝凯岛地道风味。", cta: "美食" },
      { href: "/budaya", title: "走进守护海洋的传统。", cta: "文化" },
      { href: "/bahasa", title: "学习凯语，问候当地人。", cta: "凯语" },
    ],
    pages: {
      destinasi: {
        eyebrow: "目的地",
        title: "让人难忘的凯岛胜地",
        desc: "从面粉般细腻的白沙到喀斯特崖后的隐秘泻湖，这就是人们远赴印尼东端的理由。",
      },
      makanan: {
        eyebrow: "美食",
        title: "凯岛山海之味",
        desc: "木薯主食、取之有度的海产，以及庭院里的香料，这就是凯岛人家的餐桌。",
      },
      budaya: {
        eyebrow: "文化与传统",
        title: "守护海洋的文化遗产",
        desc: "在凯岛，习俗不是陈列品，它规定何时可以捕捞、如何礼待宾客、如何化解纷争。",
      },
      bahasa: {
        eyebrow: "凯语",
        title: "用当地语言问候居民",
        desc: "几句凯语会为您赢得比千张照片更多的笑容。从这里开始。",
      },
      peta: {
        eyebrow: "珊瑚地图",
        title: "寻找凯岛海域最佳地点",
        desc: "精选海滩、泻湖与珊瑚园及其坐标。请尊重sasi：见到禁采标志，请勿采集任何东西。",
      },
      kedaruratan: {
        eyebrow: "海岸紧急信息",
        title: "保持冷静，按步骤行动",
        desc: "去海滩前请保存此页。重要联系电话可直接拨打。",
      },
    } as Record<string, PageCopy>,
    common: {
      semua: "全部",
      makanan: "主食",
      minuman: "饮品",
      kudapan: "小吃",
      sajianDitampilkan: "显示 {n} 道菜品",
      warisanDitampilkan: "显示 {n} 项文化遗产",
      kosakataCount: "{b} 个词汇中的 {a} 个",
      cariKosakata: "搜索词汇，如：海、鱼、村庄…",
      kataBelumAda: "“{q}”尚未收录",
      kamusCatatan: "村民们仍在不断完善这本词典。试试其他词。",
      pelajari: "了解更多",
    },
    footer: {
      jelajahi: "探索",
      kontak: "联系",
      admin: "管理员登录",
      desc: "凯克其尔（东南马鲁古）官方旅游门户。探索特色美食、文化、珊瑚礁、凯语及海岸安全信息。",
    },
    settings: {
      label: "设置",
      bahasa: "语言",
      tampilan: "外观",
      terang: "浅色",
      gelap: "深色",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

/** Isi placeholder {x} pada string kamus: fmt("{n} sajian", { n: 8 }) */
export function fmt(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dark: boolean;
  setDark: (dark: boolean) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");
  const [dark, setDarkState] = useState(false);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(LOCALE_KEY) as Locale;
    if (storedLocale && storedLocale in dictionaries) {
      setLocaleState(storedLocale);
    }
    setDarkState(window.localStorage.getItem(THEME_KEY) === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    window.localStorage.setItem(LOCALE_KEY, next);
    document.documentElement.lang = next;
  }

  function setDark(next: boolean) {
    setDarkState(next);
    window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  }

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, dark, setDark, t: dictionaries[locale] }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale harus dipakai di dalam <LocaleProvider>");
  }
  return ctx;
}
