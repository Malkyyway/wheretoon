"use client";

import { useRouter } from "next/navigation";

/**
 * Tombol "Komik acak": sekali klik langsung membuka satu judul acak dari
 * katalog (router.push ke /judul/<slug>). Dipakai di hero beranda dan
 * header /semua-judul. `className` menyesuaikan penempatan (hero gelap
 * vs halaman terang).
 */
export default function RandomButton({
  slugs,
  className = "inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500/20 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/20",
}: {
  slugs: string[];
  className?: string;
}) {
  const router = useRouter();

  const goRandom = () => {
    if (slugs.length === 0) return;
    const slug = slugs[Math.floor(Math.random() * slugs.length)];
    if (slug) router.push(`/judul/${slug}`);
  };

  return (
    <button
      type="button"
      onClick={goRandom}
      aria-label="Buka komik acak"
      className={className}
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
        <path d="M16 3h5v5" />
        <path d="M4 20 21 3" />
        <path d="M21 16v5h-5" />
        <path d="m15 15 6 6" />
        <path d="M4 4l5 5" />
      </svg>
      Komik acak
    </button>
  );
}
