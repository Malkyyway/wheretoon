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

const STATUS_ORDER: ListStatus[] = ["reading", "plan", "completed"];

export default function ListSayaPage() {
  const list = useSyncExternalStore(
    subscribeList,
    getListSnapshot,
    getListServerSnapshot,
  );

  const entries = Object.values(list).sort((a, b) => b.updatedAt - a.updatedAt);
  const counts = countByStatus(list);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
        List Saya
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {entries.length === 0
          ? "List bacaanmu masih kosong."
          : `${counts.reading} lagi dibaca · ${counts.plan} mau dibaca · ${counts.completed} selesai`}{" "}
        Data tersimpan di browser ini (localStorage).
      </p>

      {entries.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-600">Kamu belum menambahkan judul apa pun.</p>
          <p className="mt-1 text-sm text-slate-500">
            Buka halaman judul lalu pilih status “Lagi dibaca” atau “Mau dibaca”.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Jelajahi katalog
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {STATUS_ORDER.map((status) => {
            const group = entries.filter((e) => e.status === status);
            if (group.length === 0) return null;
            return (
              <section key={status} aria-label={STATUS_LABEL_ID[status]}>
                <h2 className="mb-3 text-lg font-bold text-slate-900">
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
    <li className="flex gap-4 rounded-xl border border-slate-200 bg-white p-3">
      <div className="w-16 shrink-0 sm:w-20">
        <CoverArt slug={title.slug} title={title.title} size="sm" />
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/judul/${title.slug}`}
          className="font-semibold text-slate-900 hover:text-emerald-700 hover:underline"
        >
          {title.title}
        </Link>
        <p className="mt-0.5 text-xs text-slate-500">
          {title.genres.join(" · ")}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1 text-xs text-slate-600">
            Chapter:
            <span className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Kurangi chapter"
                onClick={() =>
                  onUpdate(setChapter(list, entry.slug, entry.chapter - 1))
                }
                className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 text-base font-bold hover:bg-slate-100"
              >
                −
              </button>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={entry.chapter}
                onChange={(e) =>
                  onUpdate(setChapter(list, entry.slug, Number(e.target.value)))
                }
                aria-label="Nomor chapter"
                className="h-7 w-14 rounded border border-slate-300 text-center text-sm font-semibold"
              />
              <button
                type="button"
                aria-label="Tambah chapter"
                onClick={() =>
                  onUpdate(setChapter(list, entry.slug, entry.chapter + 1))
                }
                className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 text-base font-bold hover:bg-slate-100"
              >
                +
              </button>
            </span>
          </label>
          <select
            value={entry.status}
            onChange={(e) =>
              onUpdate(
                upsertEntry(list, entry.slug, {
                  status: e.target.value as ListStatus,
                }),
              )
            }
            aria-label="Status baca"
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
          >
            {(Object.keys(STATUS_LABEL_ID) as ListStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL_ID[s]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onUpdate(removeEntry(list, entry.slug))}
            className="text-xs font-medium text-rose-600 hover:underline"
          >
            Hapus
          </button>
        </div>
      </div>
    </li>
  );
}
