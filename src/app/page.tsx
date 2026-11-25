import Link from "next/link";
import {
  TITLES,
  getAllGenres,
  getPopularTitles,
  getRecentlyUpdated,
} from "@/data/titles";
import TitleCard from "@/components/TitleCard";
import HomeBrowser from "@/components/HomeBrowser";

function formatDateID(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HomePage() {
  const popular = getPopularTitles();
  const recent = getRecentlyUpdated(6);
  const genres = getAllGenres();

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 px-6 py-10 text-white shadow-lg shadow-emerald-600/20 sm:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-teal-300/20 blur-3xl"
        />
        <div className="relative">
          <h1 className="max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
            Cari manhwa, baca di tempat resmi.
          </h1>
          <p className="mt-3 max-w-xl text-emerald-50">
            WhereToon mengumpulkan link baca resmi dari WEBTOON, Tappytoon, dan
            platform legal lainnya - plus tracker biar kamu nggak lupa sudah baca
            sampai chapter berapa.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#katalog"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50"
            >
              Jelajahi katalog
            </a>
            <Link
              href="/list-saya"
              className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              List saya
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="update-terbaru">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="update-terbaru" className="text-xl font-bold text-slate-900">
            Update Terbaru
          </h2>
          <span className="text-xs text-slate-500">Episode terbaru yang terverifikasi</span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {recent.map((t) => (
            <div key={t.slug}>
              <TitleCard title={t} />
              {t.updatedAt && (
                <p className="mt-1.5 px-1 text-xs text-slate-500">
                  Update: {formatDateID(t.updatedAt)}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="populer">
        <h2 id="populer" className="mb-4 text-xl font-bold text-slate-900">
          Populer
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {popular.map((t) => (
            <TitleCard key={t.slug} title={t} />
          ))}
        </div>
      </section>

      <section aria-labelledby="semua-judul">
        <h2 id="semua-judul" className="mb-4 text-xl font-bold text-slate-900">
          Semua Judul
        </h2>
        <HomeBrowser titles={TITLES} genres={genres} />
      </section>
    </div>
  );
}
