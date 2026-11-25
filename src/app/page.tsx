import Link from "next/link";
import {
  TITLES,
  getAllGenres,
  getPopularTitles,
  getRecentlyUpdated,
  getTitleBySlug,
} from "@/data/titles";
import TitleCard from "@/components/TitleCard";
import CoverArt from "@/components/CoverArt";
import HomeBrowser from "@/components/HomeBrowser";

const HERO_GENRES = ["Fantasy", "Action", "Martial Arts", "Thriller", "Romance"];

// Kartu hero: depan Solo Leveling, belakang kiri Omniscient Reader,
// belakang kanan Tower of God (mengikuti screenshot referensi).
const HERO_SPOTLIGHT = [
  { slug: "omniscient-reader", position: "left-0 top-8 -rotate-[8deg] z-10" },
  { slug: "solo-leveling", position: "left-1/2 top-0 z-20 -translate-x-1/2" },
  { slug: "tower-of-god", position: "right-0 top-8 rotate-[8deg] z-10" },
];

export default function HomePage() {
  const popular = getPopularTitles().slice(0, 12);
  const recent = getRecentlyUpdated(6);
  const genres = getAllGenres();
  const spotlight = HERO_SPOTLIGHT.map((s) => ({
    ...s,
    title: getTitleBySlug(s.slug),
  })).filter((s) => s.title);

  return (
    <div>
      <section
        className="relative overflow-hidden rounded-3xl px-6 py-10 text-white shadow-[0_8px_24px_rgba(6,95,70,0.10),0_32px_64px_-24px_rgba(6,95,70,0.18)] sm:px-10 sm:py-14"
        style={{
          background:
            "linear-gradient(135deg, #064e3b 0%, #022c22 55%, #010f0b 100%)",
        }}
      >
        {/* garis diagonal halus */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 18px)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-teal-300/10 blur-3xl"
        />

        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Agregator Manhwa Legal
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Cari manhwa,{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                baca di tempat resmi.
              </span>
            </h1>
            <p className="mt-4 max-w-xl leading-relaxed text-emerald-50/80">
              WhereToon mengumpulkan link baca resmi dari WEBTOON, Tappytoon, dan
              platform legal lainnya - plus tracker biar kamu nggak lupa sudah baca
              sampai chapter berapa.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#katalog"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-emerald-950 shadow hover:bg-emerald-50"
              >
                Jelajahi katalog →
              </a>
              <Link
                href="/list-saya"
                className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                List saya
              </Link>
            </div>
            <p className="mt-9 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-100/60">
              Langsung ke genre
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {HERO_GENRES.map((g) => (
                <Link
                  key={g}
                  href={`/?genre=${encodeURIComponent(g)}#katalog`}
                  className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur hover:bg-white/20"
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative mx-auto hidden h-[340px] w-full max-w-md sm:block">
            {spotlight.map(({ slug, title, position }) => (
              <Link
                key={slug}
                href={`/judul/${slug}`}
                aria-label={title!.title}
                className={`absolute w-[190px] transition-all duration-300 hover:z-30 hover:rotate-0 hover:scale-110 ${position}`}
              >
                <span className="block overflow-hidden rounded-2xl shadow-[0_16px_32px_-12px_rgba(2,44,34,0.5)] ring-1 ring-white/10">
                  <CoverArt
                    slug={slug}
                    title={title!.title}
                    overlay="label"
                    loading="eager"
                    className="rounded-2xl"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="update-terbaru" className="mt-16">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="update-terbaru" className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Update Terbaru
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Episode terbaru yang terverifikasi
            </p>
          </div>
          <Link
            href="/update-terbaru"
            className="shrink-0 text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Lihat semua →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {recent.map((t) => (
            <TitleCard key={t.slug} title={t} />
          ))}
        </div>
      </section>

      <section aria-labelledby="populer" className="mt-20">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="populer" className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Populer
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Paling banyak dibaca minggu ini
            </p>
          </div>
          <Link
            href="/populer"
            className="shrink-0 text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Lihat semua →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {popular.map((t) => (
            <TitleCard key={t.slug} title={t} />
          ))}
        </div>
      </section>

      <div className="mt-16">
        <HomeBrowser titles={TITLES} genres={genres} />
      </div>
    </div>
  );
}
