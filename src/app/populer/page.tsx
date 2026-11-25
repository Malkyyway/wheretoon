import { Suspense } from "react";
import type { Metadata } from "next";
import { getPopularTitles } from "@/data/titles";
import { PAGE_SIZE, paginate, parsePageParam } from "@/lib/pagination";
import Pagination from "@/components/Pagination";
import TitleCard from "@/components/TitleCard";

export const metadata: Metadata = {
  title: { absolute: "Populer | WhereToon" },
  description:
    "Judul komik paling banyak dibaca minggu ini di WhereToon, dengan tautan baca resmi dari WEBTOON, Tappytoon, dan Manta.",
};

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

/**
 * `searchParams` dibaca di dalam anak Suspense agar cangkang halaman
 * (judul + layout) tetap bisa di-prerender statis; hanya isi daftar
 * yang di-render per permintaan sesuai `?page=N`. Daftar diambil dari
 * getPopularTitles() agar selalu mengikuti flag `popular` di data.
 */
async function PageCount({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const popular = getPopularTitles();
  const { start, end, total } = paginate(
    popular,
    parsePageParam(params.page),
  );
  return (
    <p className="text-sm text-slate-500 dark:text-zinc-400">
      Menampilkan{" "}
      <span className="font-bold text-slate-900 dark:text-white">
        {start}-{end}
      </span>{" "}
      dari {total} judul
    </p>
  );
}

async function PopularGrid({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { items, page, totalPages } = paginate(
    getPopularTitles(),
    parsePageParam(params.page),
  );
  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((t) => (
          <TitleCard key={t.slug} title={t} />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/populer"
      />
    </>
  );
}

function GridSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      aria-hidden="true"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[3/4] animate-pulse rounded-2xl bg-slate-200 dark:bg-white/5"
        />
      ))}
    </div>
  );
}

export default function PopulerPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const total = getPopularTitles().length;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Populer
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Paling banyak dibaca minggu ini
          </p>
        </div>
        <Suspense
          fallback={
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Menampilkan{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                1-{PAGE_SIZE}
              </span>{" "}
              dari {total} judul
            </p>
          }
        >
          <PageCount searchParams={searchParams} />
        </Suspense>
      </div>

      <Suspense fallback={<GridSkeleton />}>
        <PopularGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
