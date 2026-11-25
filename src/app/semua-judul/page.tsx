import { Suspense } from "react";
import type { Metadata } from "next";
import { TITLES, getAllGenres, type TitleStatus } from "@/data/titles";
import { parsePageParam } from "@/lib/pagination";
import type { StatusFilter } from "@/lib/filterTitles";
import AllTitlesBrowser from "@/components/AllTitlesBrowser";

export const metadata: Metadata = {
  title: { absolute: "Semua Judul | WhereToon" },
  description:
    "Jelajahi semua judul manhwa di WhereToon dengan tautan baca resmi dari WEBTOON, Tappytoon, dan Manta. Cari berdasarkan judul atau penulis, lalu filter berdasarkan status dan genre.",
};

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

const VALID_STATUSES: StatusFilter[] = [
  "semua",
  "ongoing",
  "completed",
  "hiatus",
];

/**
 * Nilai awal filter + halaman dibaca dari URL di server (di dalam anak
 * Suspense, agar cangkang halaman tetap bisa di-prerender statis), jadi
 * tautan seperti /semua-judul?page=3 atau /semua-judul?q=solo langsung
 * menampilkan hasil yang benar di HTML awal, bukan hanya setelah
 * hydration. Perubahan filter/halaman di sisi klien tetap disinkronkan
 * ke URL oleh AllTitlesBrowser.
 */
async function BrowserLoader({
  searchParams,
  genres,
}: {
  searchParams: SearchParams;
  genres: string[];
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const genreParam =
    typeof params.genre === "string" ? params.genre : "Semua";
  const statusParam =
    typeof params.status === "string" ? params.status : "semua";
  return (
    <AllTitlesBrowser
      titles={TITLES}
      genres={genres}
      initialQuery={q}
      initialGenre={
        ["Semua", ...genres].includes(genreParam) ? genreParam : "Semua"
      }
      initialStatus={
        (VALID_STATUSES as string[]).includes(statusParam)
          ? (statusParam as TitleStatus | "semua")
          : "semua"
      }
      initialPage={parsePageParam(params.page)}
    />
  );
}

export default function SemuaJudulPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const genres = getAllGenres();
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Semua Judul
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Katalog kurasi dengan tautan baca resmi - tanpa situs bajakan.
        </p>
      </div>
      <Suspense
        fallback={
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Memuat katalog...
          </p>
        }
      >
        <BrowserLoader searchParams={searchParams} genres={genres} />
      </Suspense>
    </div>
  );
}
