import { Suspense } from "react";
import type { Metadata } from "next";
import { TITLES } from "@/data/titles";
import { PAGE_SIZE, paginate, parsePageParam } from "@/lib/pagination";
import Pagination from "@/components/Pagination";
import TitleCard from "@/components/TitleCard";

export const metadata: Metadata = {
  title: { absolute: "Update Terbaru | WhereToon" },
  description:
    "Episode terbaru yang terverifikasi dari WEBTOON, Tappytoon, dan Manta - semua dengan tautan baca resmi.",
};

/**
 * Semua judul diurutkan berdasarkan tanggal update terakhir (paling baru
 * dulu). Judul tanpa updatedAt (tanggal tidak diketahui) diurutkan paling
 * akhir karena string kosong paling kecil dalam perbandingan menurun.
 */
function getAllByUpdated() {
  return [...TITLES].sort((a, b) =>
    (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""),
  );
}

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

/**
 * `searchParams` dibaca di dalam anak Suspense agar cangkang halaman
 * (judul + layout) tetap bisa di-prerender statis; hanya isi daftar
 * yang di-render per permintaan sesuai `?page=N`.
 */
async function PageCount({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { start, end, total } = paginate(
    getAllByUpdated(),
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

async function UpdateGrid({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { items, page, totalPages } = paginate(
    getAllByUpdated(),
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
        basePath="/update-terbaru"
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

export default function UpdateTerbaruPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Update Terbaru
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Episode terbaru yang terverifikasi
          </p>
        </div>
        <Suspense
          fallback={
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Menampilkan{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                1-{PAGE_SIZE}
              </span>{" "}
              dari {TITLES.length} judul
            </p>
          }
        >
          <PageCount searchParams={searchParams} />
        </Suspense>
      </div>

      <Suspense fallback={<GridSkeleton />}>
        <UpdateGrid searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
