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

export default function TrackerControls({ slug }: { slug: string }) {
  const list = useSyncExternalStore(
    subscribeList,
    getListSnapshot,
    getListServerSnapshot,
  );

  const entry = getEntry(list, slug);

  const update = (next: ReadingList) => saveList(next);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">Tracker Saya</h2>

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Status baca">
        {STATUS_ORDER.map((status) => {
          const active = entry?.status === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => update(upsertEntry(list, slug, { status }))}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              aria-pressed={active}
            >
              {STATUS_LABEL_ID[status]}
            </button>
          );
        })}
      </div>

      {entry && (
        <>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm text-slate-600">Chapter terakhir dibaca:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Kurangi chapter"
                onClick={() =>
                  update(setChapter(list, slug, (entry.chapter ?? 0) - 1))
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-lg font-bold text-slate-700 hover:bg-slate-100"
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
                className="h-8 w-16 rounded-md border border-slate-300 text-center text-sm font-semibold text-slate-900"
              />
              <button
                type="button"
                aria-label="Tambah chapter"
                onClick={() =>
                  update(setChapter(list, slug, (entry.chapter ?? 0) + 1))
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-lg font-bold text-slate-700 hover:bg-slate-100"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => update(removeEntry(list, slug))}
            className="text-sm font-medium text-rose-600 hover:text-rose-700 hover:underline"
          >
            Hapus dari list saya
          </button>
        </>
      )}

      {!entry && (
        <p className="text-sm text-slate-500">
          Belum ada di list kamu. Pilih status di atas untuk mulai melacak progres
          baca judul ini. Data tersimpan di browser kamu.
        </p>
      )}
    </div>
  );
}
