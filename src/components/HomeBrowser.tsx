"use client";

import { useMemo, useState } from "react";
import type { Title, TitleStatus } from "@/data/titles";
import TitleCard from "./TitleCard";

type StatusFilter = "semua" | TitleStatus;

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
    <section id="katalog" aria-label="Katalog manhwa">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Cari judul</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, penulis… (mis. Solo Leveling)"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-600 focus:outline-none"
          >
            <option value="semua">Semua</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Tamat</option>
            <option value="hiatus">Hiatus</option>
          </select>
        </label>
      </div>

      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter genre">
        {["Semua", ...genres].map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGenre(g)}
            aria-pressed={genre === g}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              genre === g
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Tidak ada judul yang cocok dengan pencarian kamu. Coba kata kunci atau
          genre lain.
        </p>
      ) : (
        <>
          <p className="mb-3 text-sm text-slate-500">
            Menampilkan {filtered.length} dari {titles.length} judul
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((t) => (
              <TitleCard key={t.slug} title={t} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
