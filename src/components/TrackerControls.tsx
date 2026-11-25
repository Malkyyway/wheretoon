"use client";

import { useSyncExternalStore } from "react";
import {
  STATUS_LABEL_ID,
  getEntry,
  getListServerSnapshot,
  getListSnapshot,
  removeEntry,
  saveList,
  setChapter,
  subscribeList,
  upsertEntry,
  type ListStatus,
  type ReadingList,
} from "@/lib/tracker";

const STATUS_ORDER: ListStatus[] = ["reading", "plan", "completed"];

export default function TrackerControls({
  slug,
  primaryLink,
}: {
  slug: string;
  primaryLink?: { platform: string; url: string };
}) {
  const list = useSyncExternalStore(
    subscribeList,
    getListSnapshot,
    getListServerSnapshot,
  );

  const entry = getEntry(list, slug);

  const update = (next: ReadingList) => saveList(next);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-emerald-500"
          aria-hidden
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
          <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
        </svg>
        Tracker baca
      </h2>

      <div
        className="mt-4 flex rounded-full bg-slate-100 p-1 dark:bg-white/5"
        role="group"
        aria-label="Status baca"
      >
        {STATUS_ORDER.map((status) => {
          const active = entry?.status === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => update(upsertEntry(list, slug, { status }))}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                active
                  ? "bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
              aria-pressed={active}
            >
              {STATUS_LABEL_ID[status]}
            </button>
          );
        })}
      </div>

      {entry && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-slate-300 dark:border-white/15">
            <button
              type="button"
              aria-label="Kurangi chapter"
              onClick={() =>
                update(setChapter(list, slug, (entry.chapter ?? 0) - 1))
              }
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              −
            </button>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={entry.chapter ?? 0}
              onChange={(e) =>
                update(setChapter(list, slug, Number(e.target.value)))
              }
              aria-label="Nomor chapter"
              className="h-9 w-12 bg-transparent text-center text-sm font-bold text-slate-900 focus:outline-none dark:text-white"
            />
            <button
              type="button"
              aria-label="Tambah chapter"
              onClick={() =>
                update(setChapter(list, slug, (entry.chapter ?? 0) + 1))
              }
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              +
            </button>
          </span>
          <span className="text-sm text-slate-500 dark:text-zinc-400">
            chapter terakhir dibaca
          </span>
        </div>
      )}

      {primaryLink && (
        <>
          <a
            href={primaryLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400"
          >
            Baca di {primaryLink.platform} ↗
          </a>
          <p className="mt-2 text-center text-xs text-slate-500 dark:text-zinc-400">
            Tautan membuka halaman judul di platform resmi.
          </p>
        </>
      )}

      {entry && (
        <button
          type="button"
          onClick={() => update(removeEntry(list, slug))}
          className="mt-3 text-sm font-medium text-rose-600 hover:text-rose-700 hover:underline dark:text-rose-400 dark:hover:text-rose-300"
        >
          Hapus dari list saya
        </button>
      )}

      {!entry && (
        <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">
          Belum ada di list kamu. Pilih status di atas untuk mulai melacak progres
          baca judul ini. Data tersimpan di browser kamu.
        </p>
      )}
    </div>
  );
}
