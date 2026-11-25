"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { TITLES } from "@/data/titles";
import CoverArt from "./CoverArt";

export default function SearchPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TITLES.slice(0, 5);
    return TITLES.filter((t) => {
      const haystack = [t.title, ...(t.altTitles ?? []), t.author ?? "", ...t.genres]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    }).slice(0, 8);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian cepat"
    >
      <button
        aria-label="Tutup pencarian"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#101713]">
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5 shrink-0 text-slate-400 dark:text-zinc-500"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, penulis, genre..."
            aria-label="Cari judul, penulis, genre"
            className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-zinc-500"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <p className="px-4 pb-1 pt-3 text-xs font-semibold text-slate-500 dark:text-zinc-400">
          {query.trim() ? "Hasil pencarian" : "Jelajahi katalog"}
        </p>
        <ul className="max-h-80 overflow-y-auto px-2 pb-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-slate-500 dark:text-zinc-400">
              Tidak ada judul yang cocok dengan pencarian kamu.
            </li>
          ) : (
            results.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/judul/${t.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <span className="w-10 shrink-0">
                    <CoverArt
                      slug={t.slug}
                      title={t.title}
                      size="sm"
                      className="rounded-md"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">
                      {t.title}
                    </span>
                    <span className="block truncate text-xs text-slate-500 dark:text-zinc-400">
                      {[t.author, ...t.genres].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full border border-slate-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:border-white/15 dark:text-zinc-300">
                    {t.links[0]?.platform ?? "WEBTOON"}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 dark:border-white/10 dark:text-zinc-400">
          <Link
            href="/#katalog"
            onClick={onClose}
            className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            ↩ Lihat semua hasil
          </Link>
          <span>Esc untuk menutup</span>
        </div>
      </div>
    </div>
  );
}
