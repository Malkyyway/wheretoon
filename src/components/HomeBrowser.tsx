"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Title } from "@/data/titles";
import { filterTitles, type StatusFilter } from "@/lib/filterTitles";
import CatalogFilters from "./CatalogFilters";
import TitleCard from "./TitleCard";

// Sinkronisasi ?genre= ke state filter TANPA menahan render statis:
// komponen ini tidak merender apa-apa, jadi fallback Suspense-nya (null)
// tidak menghilangkan konten katalog dari HTML awal. Efek jalan setelah
// hydration dan juga saat navigasi client-side ke ?genre= lain.
function GenreSync({
  genres,
  onGenre,
}: {
  genres: string[];
  onGenre: (g: string) => void;
}) {
  const searchParams = useSearchParams();
  const requested = searchParams.get("genre");
  useEffect(() => {
    if (requested && ["Semua", ...genres].includes(requested)) {
      onGenre(requested);
    }
  }, [requested, genres, onGenre]);
  return null;
}

export default function HomeBrowser({
  titles,
  genres,
}: {
  titles: Title[];
  genres: string[];
}) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Semua");
  const [status, setStatus] = useState<StatusFilter>("semua");

  const filtered = useMemo(
    () => filterTitles(titles, { query, genre, status }),
    [titles, query, genre, status],
  );

  return (
    <section id="katalog" aria-label="Katalog manhwa" className="scroll-mt-24">
      <Suspense fallback={null}>
        <GenreSync genres={genres} onGenre={setGenre} />
      </Suspense>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Semua Judul
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Katalog kurasi dengan tautan baca resmi - tanpa situs bajakan.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Menampilkan{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {filtered.length}
            </span>{" "}
            dari {titles.length} judul
          </p>
          <Link
            href="/semua-judul"
            className="shrink-0 text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Lihat semua →
          </Link>
        </div>
      </div>

      <CatalogFilters
        query={query}
        onQueryChange={setQuery}
        genre={genre}
        onGenreChange={setGenre}
        status={status}
        onStatusChange={setStatus}
        genres={genres}
      />

      {filtered.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-white/15 dark:bg-white/[0.02] dark:text-zinc-400">
          Tidak ada judul yang cocok dengan pencarian kamu. Coba kata kunci atau
          genre lain.
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {filtered.map((t) => (
            <TitleCard key={t.slug} title={t} />
          ))}
        </div>
      )}
    </section>
  );
}
