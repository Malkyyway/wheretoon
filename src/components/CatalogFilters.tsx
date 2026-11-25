"use client";

import type { StatusFilter } from "@/lib/filterTitles";

/**
 * Kotak filter katalog (pencarian + dropdown status + pil genre) yang
 * dipakai beranda (HomeBrowser) dan /semua-judul (AllTitlesBrowser).
 * Komponen terkontrol: state dipegang pemiliknya.
 */
export default function CatalogFilters({
  query,
  onQueryChange,
  genre,
  onGenreChange,
  status,
  onStatusChange,
  genres,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  genre: string;
  onGenreChange: (g: string) => void;
  status: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
  genres: string[];
}) {
  return (
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
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Cari judul, penulis... (mis. Solo Leveling)"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
          />
        </label>
        <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-600 dark:text-zinc-300">
          Status
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-600 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:[&>option]:bg-[#101713]"
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
            onClick={() => onGenreChange(g)}
            aria-pressed={genre === g}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              genre === g
                ? "bg-emerald-950 text-white shadow-sm dark:ring-1 dark:ring-emerald-500/40"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}
