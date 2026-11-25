"use client";

import { useState } from "react";

const PALETTE = [
  "from-emerald-500 to-teal-800",
  "from-sky-500 to-indigo-700",
  "from-rose-500 to-orange-600",
  "from-violet-500 to-fuchsia-700",
  "from-amber-500 to-orange-700",
  "from-cyan-500 to-blue-700",
  "from-lime-500 to-emerald-700",
  "from-fuchsia-500 to-purple-700",
  "from-teal-500 to-cyan-800",
  "from-orange-500 to-rose-700",
];

function colorFor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

function initials(title: string): string {
  const words = title
    .replace(/['’]/g, "")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
  if (words.length === 0) return "WT";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export type CoverOverlay = "none" | "catalog" | "label";

/**
 * Poster cover asli (self-hosted di public/covers/<slug>.jpg, diambil dari
 * og:image halaman resmi tiap judul) dengan placeholder gradien + inisial
 * besar sebagai FALLBACK kalau file cover gagal dimuat. Overlay "catalog"
 * menambah chip MANHWA, chip platform, dan jumlah chapter di atas poster
 * (untuk kartu katalog). Overlay "label" menambah judul di bawah poster
 * (untuk kartu hero).
 */
export default function CoverArt({
  slug,
  title,
  platform,
  episodes,
  overlay = "none",
  size = "md",
  loading = "lazy",
  className = "rounded-xl",
}: {
  slug: string;
  title: string;
  platform?: string;
  episodes?: number;
  overlay?: CoverOverlay;
  size?: "sm" | "md" | "lg";
  /** "lazy" default (katalog/detail/list); hero memakai "eager". */
  loading?: "lazy" | "eager";
  className?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const initialSize =
    size === "lg"
      ? "text-[6rem] sm:text-[8rem]"
      : size === "sm"
        ? "text-4xl"
        : "text-6xl";
  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br ${colorFor(slug)} ${className}`}
      role="img"
      aria-label={`Cover ${title}`}
    >
      {imgFailed ? (
        <>
          {/* garis diagonal halus */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(115deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 16px)",
            }}
          />
          {/* inisial besar di tengah */}
          <span
            aria-hidden
            className={`absolute inset-0 flex select-none items-center justify-center font-black tracking-tighter text-white/85 ${initialSize}`}
          >
            {initials(title)}
          </span>
        </>
      ) : (
        <img
          src={`/covers/${slug}.jpg`}
          alt=""
          aria-hidden
          loading={loading}
          draggable={false}
          onError={() => setImgFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {overlay === "catalog" && (
        <>
          <span className="absolute left-2 top-2 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            Manhwa
          </span>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-2 pb-2 pt-8">
            <div className="flex items-center justify-between gap-2">
              {platform ? (
                <span className="rounded-md border border-white/25 bg-black/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {platform}
                </span>
              ) : (
                <span />
              )}
              {episodes ? (
                <span className="text-xs font-semibold text-white drop-shadow">
                  {episodes} ch
                </span>
              ) : null}
            </div>
          </div>
        </>
      )}

      {overlay === "label" && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent px-3 pb-3 pt-8">
          <p className="line-clamp-2 text-sm font-bold text-white drop-shadow">
            {title}
          </p>
        </div>
      )}
    </div>
  );
}
