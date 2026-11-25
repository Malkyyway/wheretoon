"use client";

import { useSyncExternalStore, type MouseEvent } from "react";
import {
  getEntry,
  getListServerSnapshot,
  getListSnapshot,
  removeEntry,
  saveList,
  subscribeList,
  upsertEntry,
} from "@/lib/tracker";

/**
 * Tombol quick-add di kanan atas poster kartu.
 * Belum di list: "+" (muncul saat hover) -> tambah sebagai "Mau dibaca".
 * Sudah di list: "✓" (selalu terlihat) -> klik untuk menghapus dari list.
 */
export default function QuickAddButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const list = useSyncExternalStore(
    subscribeList,
    getListSnapshot,
    getListServerSnapshot,
  );
  const entry = getEntry(list, slug);
  const inList = !!entry;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      saveList(removeEntry(list, slug));
    } else {
      saveList(upsertEntry(list, slug, { status: "plan", chapter: 0 }));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        inList
          ? `Hapus ${title} dari List Saya`
          : `Tambah ${title} ke List Saya`
      }
      aria-pressed={inList}
      title={
        inList ? "Sudah di list - klik untuk menghapus" : "Tambah ke List Saya"
      }
      className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-teal-900/90 text-lg font-bold leading-none text-white shadow-md backdrop-blur-sm transition-opacity duration-200 hover:bg-teal-800 ${
        inList
          ? "opacity-100"
          : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 max-sm:opacity-100"
      }`}
    >
      {inList ? "✓" : "+"}
    </button>
  );
}
