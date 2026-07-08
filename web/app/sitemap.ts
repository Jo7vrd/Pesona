import type { MetadataRoute } from "next";

import { getAllBudaya, getAllMakanan } from "@/lib/api/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [makanan, budaya] = await Promise.all([
    getAllMakanan(),
    getAllBudaya(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/makanan`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/budaya`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/peta`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/bahasa`, changeFrequency: "weekly", priority: 0.8 },
    {
      url: `${BASE_URL}/kedaruratan`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  return [
    ...staticRoutes,
    ...makanan.map((m) => ({
      url: `${BASE_URL}/makanan/${m.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...budaya.map((b) => ({
      url: `${BASE_URL}/budaya/${b.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
