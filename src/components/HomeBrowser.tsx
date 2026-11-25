"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Title, TitleStatus } from "@/data/titles";
import TitleCard from "./TitleCard";

type StatusFilter = "semua" | TitleStatus;

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

  const filtered = useMemo(() => {
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
  }, [titles, query, genre, status]);

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
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Menampilkan{" "}
          <span className="font-bold text-slate-900 dark:text-white">
            {filtered.length}
          </span>{" "}
          dari {titles.length} judul
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Cari judul</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul, penulis... (mis. Solo Leveling)"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
            />
          </label>
          <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-600 dark:text-zinc-300">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-600 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:[&>option]:bg-zinc-900"
            >
              <option value="semua">Semua</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Tamat</option>
              <option value="hiatus">Hiatus</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter genre">
          {["Semua", ...genres].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(g)}
              aria-pressed={genre === g}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                genre === g
                  ? "bg-emerald-500 text-black shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

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
