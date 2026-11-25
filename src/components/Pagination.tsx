"use client";

import Link from "next/link";
import { buildPageHref } from "@/lib/pagination";

/**
 * Komponen paginasi bersama untuk /update-terbaru, /semua-judul, dan
 * /populer. Navigasi memakai Link biasa sehingga URL mencerminkan halaman
 * dan Next.js menggulir ke atas saat pindah halaman. `extraParams`
 * mempertahankan query param lain (mis. filter di /semua-judul).
 */

type PageItem = number | "gap";

function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);
  if (current <= 3) {
    start = 2;
    end = 4;
  }
  if (current >= total - 2) {
    start = total - 3;
    end = total - 1;
  }
  const items: PageItem[] = [1];
  if (start > 2) items.push("gap");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("gap");
  items.push(total);
  return items;
}

const BTN =
  "rounded-full px-3.5 py-2 text-sm font-medium transition";
const PAGE_LINK = `${BTN} bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10 dark:hover:bg-white/10`;
const PAGE_ACTIVE = `${BTN} bg-emerald-600 text-white shadow-sm`;
const NAV_LINK = `${BTN} bg-white font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10 dark:hover:bg-white/10`;
const DISABLED = `${BTN} cursor-not-allowed bg-slate-50 font-semibold text-slate-400 opacity-70 dark:bg-white/[0.03] dark:text-zinc-600`;

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  extraParams = {},
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  extraParams?: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) =>
    buildPageHref(basePath, page, extraParams);

  return (
    <nav
      aria-label="Paginasi"
      className="mt-8 flex flex-wrap items-center justify-center gap-1.5"
    >
      {currentPage > 1 ? (
        <Link
          href={hrefFor(currentPage - 1)}
          aria-label="Ke halaman sebelumnya"
          className={NAV_LINK}
        >
          ← Sebelumnya
        </Link>
      ) : (
        <span aria-disabled="true" className={DISABLED}>
          ← Sebelumnya
        </span>
      )}

      {getPageItems(currentPage, totalPages).map((item, i) =>
        item === "gap" ? (
          <span
            key={`gap-${i}`}
            aria-hidden="true"
            className="px-1 text-sm text-slate-400 dark:text-zinc-500"
          >
            …
          </span>
        ) : item === currentPage ? (
          <span key={item} aria-current="page" className={PAGE_ACTIVE}>
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-label={`Ke halaman ${item}`}
            className={PAGE_LINK}
          >
            {item}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={hrefFor(currentPage + 1)}
          aria-label="Ke halaman berikutnya"
          className={NAV_LINK}
        >
          Berikutnya →
        </Link>
      ) : (
        <span aria-disabled="true" className={DISABLED}>
          Berikutnya →
        </span>
      )}
    </nav>
  );
}
