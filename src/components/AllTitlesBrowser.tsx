"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Title } from "@/data/titles";
import { filterTitles, type StatusFilter } from "@/lib/filterTitles";
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

// Sinkronisasi query param URL (?q=, ?status=, ?genre=, ?page=) ke state
// filter TANPA menahan render: komponen ini tidak merender apa-apa, jadi
// fallback Suspense-nya (null) tidak menghilangkan konten dari HTML awal.
// Pola yang sama dengan GenreSync di HomeBrowser.
function UrlSync({
  genres,
  onSync,
}: {
  genres: string[];
  onSync: (values: {
    query: string;
    genre: string;
    status: StatusFilter;
    page: number;
  }) => void;
}) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const genreParam = searchParams.get("genre") ?? "Semua";
  const statusParam = searchParams.get("status") ?? "semua";
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
      page: parsePageParam(pageParam ?? undefined),
    });
  }, [q, genreParam, statusParam, pageParam, genres, onSync]);
  return null;
}

export default function AllTitlesBrowser({
  titles,
  genres,
  initialQuery = "",
  initialGenre = "Semua",
  initialStatus = "semua",
  initialPage = 1,
}: {
  titles: Title[];
  genres: string[];
  initialQuery?: string;
  initialGenre?: string;
  initialStatus?: StatusFilter;
  initialPage?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState(initialGenre);
  const [status, setStatus] = useState<StatusFilter>(initialStatus);
  const [page, setPage] = useState(initialPage);

  // Terima nilai dari URL hanya bila berbeda, agar efek sinkronisasi
  // tidak menimpa ketikan pengguna atau memicu putaran render.
  const syncFromUrl = useCallback(
    (values: {
      query: string;
      genre: string;
      status: StatusFilter;
      page: number;
    }) => {
      setQuery((prev) => (prev === values.query ? prev : values.query));
      setGenre((prev) => (prev === values.genre ? prev : values.genre));
      setStatus((prev) => (prev === values.status ? prev : values.status));
      setPage((prev) => (prev === values.page ? prev : values.page));
    },
    [],
  );

  const filtered = useMemo(
    () => filterTitles(titles, { query, genre, status }),
    [titles, query, genre, status],
  );
  const { items, page: activePage, totalPages, total, start, end } =
    paginate(filtered, page);

  // Param filter untuk dipertahankan di tautan paginasi (hanya yang aktif).
  const extraParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (query.trim() !== "") params.q = query.trim();
    if (status !== "semua") params.status = status;
    if (genre !== "Semua") params.genre = genre;
    return params;
  }, [query, status, genre]);

  // Setiap perubahan filter kembali ke halaman 1 dan menulis filternya
  // ke URL agar bisa di-refresh atau dibagikan.
  const applyFilterChange = useCallback(
    (next: { query: string; genre: string; status: StatusFilter }) => {
      setQuery(next.query);
      setGenre(next.genre);
      setStatus(next.status);
      setPage(1);
      const params: Record<string, string> = {};
      if (next.query.trim() !== "") params.q = next.query.trim();
      if (next.status !== "semua") params.status = next.status;
      if (next.genre !== "Semua") params.genre = next.genre;
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
        onQueryChange={(q) => applyFilterChange({ query: q, genre, status })}
        genre={genre}
        onGenreChange={(g) => applyFilterChange({ query, genre: g, status })}
        status={status}
        onStatusChange={(s) => applyFilterChange({ query, genre, status: s })}
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
