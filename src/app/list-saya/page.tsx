"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { getTitleBySlug } from "@/data/titles";
import {
  STATUS_LABEL_ID,
  countByStatus,
  getListServerSnapshot,
  getListSnapshot,
  removeEntry,
  saveList,
  setChapter,
  subscribeList,
  upsertEntry,
  type ListEntry,
  type ListStatus,
  type ReadingList,
} from "@/lib/tracker";
import CoverArt from "@/components/CoverArt";
import Dropdown from "@/components/Dropdown";

const STATUS_ORDER: ListStatus[] = ["reading", "plan", "completed"];

export default function ListSayaPage() {
  const list = useSyncExternalStore(
    subscribeList,
    getListSnapshot,
    getListServerSnapshot,
  );

  const entries = Object.values(list).sort((a, b) => b.updatedAt - a.updatedAt);
  const counts = countByStatus(list);
  const totalChapters = entries.reduce((sum, e) => sum + (e.chapter || 0), 0);

  const stats = [
    { label: "Total judul", value: entries.length },
    { label: "Lagi dibaca", value: counts.reading },
    { label: "Selesai", value: counts.completed },
    { label: "Mau dibaca", value: counts.plan },
    { label: "Total chapter dibaca", value: totalChapters },
  ];

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        List Saya
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
        {entries.length === 0
          ? "List bacaanmu masih kosong."
          : `${counts.reading} lagi dibaca · ${counts.plan} mau dibaca · ${counts.completed} selesai`}{" "}
        Data tersimpan di browser ini (localStorage).
      </p>

      {entries.length > 0 && (
        <div
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          aria-label="Statistik list bacaan"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {s.value}
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-zinc-400">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 ? (
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-white/15 dark:bg-white/[0.02]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7"
              aria-hidden
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
              <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
            </svg>
          </span>
          <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
            List bacaanmu masih kosong
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-zinc-400">
            Buka halaman judul lalu pilih status “Lagi dibaca” atau “Mau dibaca”.
            Progress chapter-nya otomatis tersimpan di sini.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400"
          >
            Jelajahi katalog
          </Link>
        </div>
      ) : (
        <div className="mx-auto mt-8 max-w-3xl space-y-8">
          {STATUS_ORDER.map((status) => {
            const group = entries.filter((e) => e.status === status);
            if (group.length === 0) return null;
            return (
              <section key={status} aria-label={STATUS_LABEL_ID[status]}>
                <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
                  {STATUS_LABEL_ID[status]} ({group.length})
                </h2>
                <ul className="space-y-3">
                  {group.map((entry) => (
                    <ListRow
                      key={entry.slug}
                      entry={entry}
                      list={list}
                      onUpdate={saveList}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ListRow({
  entry,
  list,
  onUpdate,
}: {
  entry: ListEntry;
  list: ReadingList;
  onUpdate: (next: ReadingList) => void;
}) {
  const title = getTitleBySlug(entry.slug);
  if (!title) return null;

  return (
    <li className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="w-16 shrink-0 sm:w-20">
        <CoverArt slug={title.slug} title={title.title} size="sm" className="rounded-lg" />
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/judul/${title.slug}`}
          className="font-bold text-slate-900 hover:text-emerald-600 hover:underline dark:text-white dark:hover:text-emerald-400"
        >
          {title.title}
        </Link>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
          {title.genres.join(" · ")}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-slate-300 dark:border-white/15">
            <button
              type="button"
              aria-label="Kurangi chapter"
              onClick={() =>
                onUpdate(setChapter(list, entry.slug, entry.chapter - 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              −
            </button>
            <span className="px-1 text-sm font-bold text-slate-900 dark:text-white">
              Ch.
            </span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={entry.chapter}
              onChange={(e) =>
                onUpdate(setChapter(list, entry.slug, Number(e.target.value)))
              }
              aria-label="Nomor chapter"
              className="h-8 w-10 bg-transparent text-center text-sm font-bold text-slate-900 focus:outline-none dark:text-white"
            />
            <button
              type="button"
              aria-label="Tambah chapter"
              onClick={() =>
                onUpdate(setChapter(list, entry.slug, entry.chapter + 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-base font-bold text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              +
            </button>
          </span>
          <Dropdown
            value={entry.status}
            options={(Object.keys(STATUS_LABEL_ID) as ListStatus[]).map(
              (s) => ({ value: s, label: STATUS_LABEL_ID[s] }),
            )}
            onChange={(s) =>
              onUpdate(upsertEntry(list, entry.slug, { status: s }))
            }
            ariaLabel="Status baca"
            buttonClassName="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-zinc-200"
          />
          {title.links[0] && (
            <a
              href={title.links[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-black transition hover:bg-emerald-400"
            >
              Lanjutkan membaca ↗
            </a>
          )}
          <button
            type="button"
            onClick={() => onUpdate(removeEntry(list, entry.slug))}
            aria-label={`Hapus ${title.title} dari list`}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
