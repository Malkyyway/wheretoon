/**
 * Helper paginasi bersama untuk /update-terbaru, /semua-judul, dan /populer.
 * Halaman dibaca dari query param `?page=N` sehingga URL mencerminkan
 * halaman aktif dan aman di-refresh atau dibagikan.
 */

export const PAGE_SIZE = 30;

export interface PageSlice<T> {
  items: T[];
  /** Nomor halaman aktif setelah dijepit ke rentang yang valid. */
  page: number;
  totalPages: number;
  total: number;
  /** Nomor urut (1-based) item pertama di halaman ini, 0 bila kosong. */
  start: number;
  /** Nomor urut (1-based) item terakhir di halaman ini. */
  end: number;
}

/** Ubah nilai mentah `page` dari URL menjadi nomor halaman yang valid (>= 1). */
export function parsePageParam(
  value: string | string[] | undefined,
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = raw === undefined ? NaN : Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

/**
 * Potong `all` ke satu halaman. Halaman yang diminta di luar rentang
 * dijepit ke halaman pertama/terakhir, jadi `?page=99` tetap menampilkan
 * halaman terakhir, bukan halaman kosong.
 */
export function paginate<T>(
  all: T[],
  requestedPage: number,
  perPage: number = PAGE_SIZE,
): PageSlice<T> {
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (page - 1) * perPage;
  const items = all.slice(startIndex, startIndex + perPage);
  return {
    items,
    page,
    totalPages,
    total,
    start: total === 0 ? 0 : startIndex + 1,
    end: Math.min(startIndex + perPage, total),
  };
}

/**
 * Bangun href halaman dengan query param lain yang dipertahankan
 * (mis. filter di /semua-judul). `page=1` dihilangkan dari URL agar
 * tautan halaman pertama tetap bersih.
 */
export function buildPageHref(
  basePath: string,
  page: number,
  extraParams: Record<string, string> = {},
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(extraParams)) {
    if (value !== "") params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
