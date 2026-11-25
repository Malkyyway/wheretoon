import type { MetadataRoute } from "next";
import { TITLES } from "@/data/titles";

const BASE_URL = "https://wheretoon.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/list-saya`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...TITLES.map((t) => ({
      url: `${BASE_URL}/judul/${t.slug}`,
      lastModified: t.updatedAt ? new Date(`${t.updatedAt}T00:00:00`) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
