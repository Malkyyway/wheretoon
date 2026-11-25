import type { Title, TitleStatus } from "@/data/titles";

export type StatusFilter = "semua" | TitleStatus;

export interface TitleFilters {
  query: string;
  genre: string;
  status: StatusFilter;
}

/**
 * Logika filter katalog yang dipakai beranda (HomeBrowser) dan
 * /semua-judul (AllTitlesBrowser). Urutan hasil mengikuti urutan
 * katalog (TITLES), tanpa pengurutan tambahan.
 */
export function filterTitles(
  titles: Title[],
  { query, genre, status }: TitleFilters,
): Title[] {
  const q = query.trim().toLowerCase();
  return titles.filter((t) => {
    if (genre !== "Semua" && !t.genres.includes(genre)) return false;
    if (status !== "semua" && t.status !== status) return false;
    if (!q) return true;
    const haystack = [t.title, ...(t.altTitles ?? []), t.author ?? ""]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
