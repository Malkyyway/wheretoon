import type { Title, TitleStatus } from "@/data/titles";

export type StatusFilter = "semua" | TitleStatus;

export interface TitleFilters {
  query: string;
  genre: string;
  status: StatusFilter;
}

/**
 * Logika filter katalog yang dipakai /semua-judul (AllTitlesBrowser).
 * Urutan hasil mengikuti urutan katalog (TITLES), tanpa pengurutan tambahan.
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

/** Kunci sortir katalog, dibaca dari query param `?sort=`. */
export type SortKey = "default" | "terbaru" | "az" | "chapter";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "terbaru", label: "Terbaru" },
  { value: "az", label: "A-Z" },
  { value: "chapter", label: "Chapter terbanyak" },
];

/** Ubah nilai mentah `sort` dari URL menjadi kunci sortir yang valid. */
export function parseSortParam(
  value: string | string[] | undefined,
): SortKey {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "terbaru" || raw === "az" || raw === "chapter") return raw;
  return "default";
}

/**
 * Urutkan judul sesuai kunci sortir. "default" mengembalikan urutan
 * katalog apa adanya; "terbaru" menaruh judul tanpa updatedAt paling
 * akhir; "chapter" menaruh judul tanpa episode count paling akhir.
 * Tidak mengubah array masukan.
 */
export function sortTitles(titles: Title[], sort: SortKey): Title[] {
  switch (sort) {
    case "terbaru":
      return [...titles].sort((a, b) =>
        (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""),
      );
    case "az":
      return [...titles].sort((a, b) =>
        a.title.localeCompare(b.title, "id"),
      );
    case "chapter":
      return [...titles].sort(
        (a, b) => (b.episodes ?? -1) - (a.episodes ?? -1),
      );
    default:
      return titles;
  }
}
