"use client";

import Dropdown from "./Dropdown";
import {
  SORT_OPTIONS,
  type SortKey,
  type StatusFilter,
} from "@/lib/filterTitles";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Tamat" },
  { value: "hiatus", label: "Hiatus" },
];

/**
 * Kotak filter katalog (pencarian + dropdown status + pil genre) yang
 * dipakai /semua-judul (AllTitlesBrowser).
 * Komponen terkontrol: state dipegang pemiliknya.
 */
export default function CatalogFilters({
  query,
  onQueryChange,
  genre,
  onGenreChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  genres,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  genre: string;
  onGenreChange: (g: string) => void;
  status: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
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
        <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-600 dark:text-zinc-300">
          Status
          <Dropdown
            value={status}
            options={STATUS_OPTIONS}
            onChange={onStatusChange}
            ariaLabel="Status"
          />
        </span>
        <span className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-600 dark:text-zinc-300">
          Urutkan
          <Dropdown
            value={sort}
            options={SORT_OPTIONS}
            onChange={onSortChange}
            ariaLabel="Urutkan"
          />
        </span>
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
