import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ACCESS_LABEL,
  LANGUAGE_LABEL,
  STATUS_LABEL,
  TITLES,
  getRelatedTitles,
  getTitleBySlug,
} from "@/data/titles";
import CoverArt from "@/components/CoverArt";
import TitleCard from "@/components/TitleCard";
import TrackerControls from "@/components/TrackerControls";

export function generateStaticParams() {
  return TITLES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/judul/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const title = getTitleBySlug(slug);
  if (!title) return { title: "Judul tidak ditemukan" };
  const description = `${title.title} - ${title.synopsis} Baca legal di ${title.links
    .map((l) => l.platform)
    .join(", ")}. Lacak progres bacaanmu di WhereToon.`;
  return {
    title: `${title.title} - Baca Legal & Lacak Progres`,
    description,
    openGraph: {
      title: `${title.title} | WhereToon`,
      description,
      type: "website",
    },
  };
}

const STATUS_STYLE: Record<string, string> = {
  ongoing: "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800",
  completed: "bg-slate-200 text-slate-700",
  hiatus: "bg-amber-100 text-amber-800",
};

export default async function TitleDetailPage({
  params,
}: PageProps<"/judul/[slug]">) {
  const { slug } = await params;
  const title = getTitleBySlug(slug);
  if (!title) notFound();

  const related = getRelatedTitles(title);

  return (
    <div>
      <Link
        href="/"
        className="mb-5 inline-block text-sm font-medium text-emerald-700 hover:underline"
      >
        ← Kembali ke katalog
      </Link>

      <article className="grid gap-6 md:grid-cols-[240px_1fr]">
        <div>
          <CoverArt slug={title.slug} title={title.title} size="lg" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[title.status]}`}
            >
              {STATUS_LABEL[title.status]}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              Manhwa
            </span>
            <span className="text-sm text-slate-500">{title.year}</span>
            {title.episodes && (
              <span className="text-sm text-slate-500">
                {title.episodes} episode
              </span>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            {title.title}
          </h1>
          {title.altTitles && (
            <p className="mt-1 text-sm text-slate-500">
              {title.altTitles.join(" · ")}
            </p>
          )}
          {title.author && (
            <p className="mt-2 text-sm text-slate-600">
              Kreator: <span className="font-medium text-slate-900">{title.author}</span>
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {title.genres.map((g) => (
              <span
                key={g}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {g}
              </span>
            ))}
          </div>

          <p className="mt-4 leading-relaxed text-slate-700">{title.synopsis}</p>
        </div>
      </article>

      <section aria-labelledby="baca-di" className="mt-8">
        <h2 id="baca-di" className="mb-3 text-xl font-bold text-slate-900">
          Baca di
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Link di bawah mengarah ke platform resmi. WhereToon tidak menyimpan
          konten komik - silakan baca di sumber resminya untuk mendukung kreator.
        </p>
        <ul className="space-y-3">
          {title.links.map((link) => (
            <li
              key={`${link.platform}-${link.url}`}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">{link.platform}</p>
                <p className="mt-0.5 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded bg-slate-100 px-2 py-0.5">
                    Bahasa: {LANGUAGE_LABEL[link.language]}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5">
                    {ACCESS_LABEL[link.access]}
                  </span>
                  {link.note && <span>{link.note}</span>}
                </p>
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/30 hover:from-emerald-700 hover:to-teal-700"
              >
                Baca di {link.platform} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Tracker" className="mt-8">
        <TrackerControls slug={title.slug} />
      </section>

      {related.length > 0 && (
        <section aria-labelledby="judul-serupa" className="mt-10">
          <h2 id="judul-serupa" className="mb-4 text-xl font-bold text-slate-900">
            Judul serupa
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((t) => (
              <TitleCard key={t.slug} title={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
