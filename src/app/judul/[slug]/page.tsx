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
  ongoing: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  completed: "bg-slate-500/15 text-slate-500 dark:text-zinc-400",
  hiatus: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
};

function formatDateID(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function TitleDetailPage({
  params,
}: PageProps<"/judul/[slug]">) {
  const { slug } = await params;
  const title = getTitleBySlug(slug);
  if (!title) notFound();

  const related = getRelatedTitles(title, 6);
  const primaryLink = title.links[0];
  const metaLine = [
    title.author,
    String(title.year),
    title.episodes ? `${title.episodes} chapter` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const infoRows: [string, string][] = [
    ["Penulis", title.author ?? "-"],
    ["Tahun", String(title.year)],
    ["Total chapter", title.episodes ? String(title.episodes) : "-"],
    ["Update terakhir", title.updatedAt ? formatDateID(title.updatedAt) : "-"],
  ];

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-zinc-400">
          <li>
            <Link
              href="/"
              className="hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              Beranda
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href="/#katalog"
              className="hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              Katalog
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li
            aria-current="page"
            className="font-semibold text-emerald-600 dark:text-emerald-400"
          >
            {title.title}
          </li>
        </ol>
      </nav>
      <Link
        href="/"
        className="mb-5 inline-block text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
      >
        ← Kembali ke katalog
      </Link>

      <article className="grid gap-6 md:grid-cols-[280px_1fr]">
        <div>
          <CoverArt
            slug={title.slug}
            title={title.title}
            size="lg"
            className="rounded-2xl"
          />
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-white/10 dark:bg-white/[0.04]">
            {infoRows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 border-b border-slate-100 py-2 last:border-0 dark:border-white/5"
              >
                <span className="text-slate-500 dark:text-zinc-400">{label}</span>
                <span className="text-right font-semibold text-slate-900 dark:text-white">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${STATUS_STYLE[title.status]}`}
            >
              {STATUS_LABEL[title.status]}
            </span>
            <span className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-bold uppercase text-slate-600 dark:border-white/15 dark:text-zinc-300">
              Manhwa
            </span>
            {primaryLink && (
              <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold uppercase text-white dark:bg-white dark:text-black">
                {primaryLink.platform}
              </span>
            )}
          </div>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            {title.title}
          </h1>
          {title.altTitles && (
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              {title.altTitles.join(" · ")}
            </p>
          )}
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">{metaLine}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {title.genres.map((g) => (
              <span
                key={g}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-white/5 dark:text-zinc-300"
              >
                {g}
              </span>
            ))}
          </div>

          <p className="mt-4 leading-relaxed text-slate-700 dark:text-zinc-300">
            {title.synopsis}
          </p>

          <div className="mt-6">
            <TrackerControls slug={title.slug} primaryLink={primaryLink} />
          </div>
        </div>
      </article>

      <section aria-labelledby="baca-di" className="mt-10">
        <h2 id="baca-di" className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
          Baca di
        </h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-zinc-400">
          Link di bawah mengarah ke platform resmi. WhereToon tidak menyimpan
          konten komik - silakan baca di sumber resminya untuk mendukung kreator.
        </p>
        <ul className="space-y-3">
          {title.links.map((link) => (
            <li
              key={`${link.platform}-${link.url}`}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{link.platform}</p>
                <p className="mt-0.5 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-zinc-400">
                  <span className="rounded bg-slate-100 px-2 py-0.5 dark:bg-white/5">
                    Bahasa: {LANGUAGE_LABEL[link.language]}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 dark:bg-white/5">
                    {ACCESS_LABEL[link.access]}
                  </span>
                  {link.note && <span>{link.note}</span>}
                </p>
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-emerald-400"
              >
                Baca di {link.platform} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="mirip-dengan-ini" className="mt-10">
          <h2 id="mirip-dengan-ini" className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
            Mirip dengan ini
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {related.map((t) => (
              <TitleCard key={t.slug} title={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
