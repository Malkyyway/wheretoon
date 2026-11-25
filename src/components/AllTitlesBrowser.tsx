"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Title } from "@/data/titles";
import {
  filterTitles,
  parseSortParam,
  sortTitles,
  type SortKey,
  type StatusFilter,
} from "@/lib/filterTitles";
import { buildPageHref, paginate, parsePageParam } from "@/lib/pagination";
import CatalogFilters from "./CatalogFilters";
import Pagination from "./Pagination";
import TitleCard from "./TitleCard";

const VALID_STATUSES: StatusFilter[] = [
  "semua",
  "ongoing",
  "completed",
  "hiatus",
];

// Sinkronisasi query param URL (?q=, ?status=, ?genre=, ?sort=, ?page=)
// ke state filter TANPA menahan render: komponen ini tidak merender
// apa-apa, jadi fallback Suspense-nya (null) tidak menghilangkan konten
// dari HTML awal.
function UrlSync({
  genres,
  onSync,
}: {
  genres: string[];
  onSync: (values: {
    query: string;
    genre: string;
    status: StatusFilter;
    sort: SortKey;
    page: number;
  }) => void;
}) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const genreParam = searchParams.get("genre") ?? "Semua";
  const statusParam = searchParams.get("status") ?? "semua";
  const sortParam = searchParams.get("sort");
  const pageParam = searchParams.get("page");
  useEffect(() => {
    onSync({
      query: q,
      genre: ["Semua", ...genres].includes(genreParam)
        ? genreParam
        : "Semua",
      status: (VALID_STATUSES as string[]).includes(statusParam)
        ? (statusParam as StatusFilter)
        : "semua",
      sort: parseSortParam(sortParam ?? undefined),
      page: parsePageParam(pageParam ?? undefined),
    });
  }, [q, genreParam, statusParam, sortParam, pageParam, genres, onSync]);
  return null;
}

export default function AllTitlesBrowser({
  titles,
  genres,
  initialQuery = "",
  initialGenre = "Semua",
  initialStatus = "semua",
  initialSort = "default",
  initialPage = 1,
}: {
  titles: Title[];
  genres: string[];
  initialQuery?: string;
  initialGenre?: string;
  initialStatus?: StatusFilter;
  initialSort?: SortKey;
  initialPage?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState(initialGenre);
  const [status, setStatus] = useState<StatusFilter>(initialStatus);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [page, setPage] = useState(initialPage);

  // Terima nilai dari URL hanya bila berbeda, agar efek sinkronisasi
  // tidak menimpa ketikan pengguna atau memicu putaran render.
  const syncFromUrl = useCallback(
    (values: {
      query: string;
      genre: string;
      status: StatusFilter;
      sort: SortKey;
      page: number;
    }) => {
      setQuery((prev) => (prev === values.query ? prev : values.query));
      setGenre((prev) => (prev === values.genre ? prev : values.genre));
      setStatus((prev) => (prev === values.status ? prev : values.status));
      setSort((prev) => (prev === values.sort ? prev : values.sort));
      setPage((prev) => (prev === values.page ? prev : values.page));
    },
    [],
  );

  const filtered = useMemo(
    () => sortTitles(filterTitles(titles, { query, genre, status }), sort),
    [titles, query, genre, status, sort],
  );
  const { items, page: activePage, totalPages, total, start, end } =
    paginate(filtered, page);

  // Param filter untuk dipertahankan di tautan paginasi (hanya yang aktif).
  const extraParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (query.trim() !== "") params.q = query.trim();
    if (status !== "semua") params.status = status;
    if (genre !== "Semua") params.genre = genre;
    if (sort !== "default") params.sort = sort;
    return params;
  }, [query, status, genre, sort]);

  // Setiap perubahan filter/sortir kembali ke halaman 1 dan menulis
  // filternya ke URL agar bisa di-refresh atau dibagikan.
  const applyChange = useCallback(
    (next: {
      query: string;
      genre: string;
      status: StatusFilter;
      sort: SortKey;
    }) => {
      setQuery(next.query);
      setGenre(next.genre);
      setStatus(next.status);
      setSort(next.sort);
      setPage(1);
      const params: Record<string, string> = {};
      if (next.query.trim() !== "") params.q = next.query.trim();
      if (next.status !== "semua") params.status = next.status;
      if (next.genre !== "Semua") params.genre = next.genre;
      if (next.sort !== "default") params.sort = next.sort;
      router.replace(buildPageHref(pathname, 1, params), { scroll: false });
    },
    [router, pathname],
  );

  return (
    <section aria-label="Katalog semua judul">
      <Suspense fallback={null}>
        <UrlSync genres={genres} onSync={syncFromUrl} />
      </Suspense>

      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Menampilkan{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {total === 0 ? 0 : `${start}-${end}`}
          </span>{" "}
          dari {total} judul
        </p>
      </div>

      <CatalogFilters
        query={query}
        onQueryChange={(q) => applyChange({ query: q, genre, status, sort })}
        genre={genre}
        onGenreChange={(g) => applyChange({ query, genre: g, status, sort })}
        status={status}
        onStatusChange={(s) => applyChange({ query, genre, status: s, sort })}
        sort={sort}
        onSortChange={(s) => applyChange({ query, genre, status, sort: s })}
        genres={genres}
      />

      {filtered.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-white/15 dark:bg-white/[0.02] dark:text-zinc-400">
          Tidak ada judul yang cocok dengan pencarian kamu. Coba kata kunci atau
          genre lain.
        </p>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {items.map((t) => (
              <TitleCard key={t.slug} title={t} />
            ))}
          </div>
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            basePath={pathname}
            extraParams={extraParams}
          />
        </>
      )}
    </section>
  );
}
