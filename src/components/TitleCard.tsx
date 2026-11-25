import Link from "next/link";
import type { Title } from "@/data/titles";
import { STATUS_LABEL } from "@/data/titles";
import CoverArt from "./CoverArt";
import QuickAddButton from "./QuickAddButton";

const STATUS_STYLE: Record<string, string> = {
  ongoing: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  completed: "bg-slate-500/15 text-slate-500 dark:text-zinc-400",
  hiatus: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
};

const STATUS_DOT: Record<string, string> = {
  ongoing: "bg-emerald-500",
  completed: "bg-zinc-400",
  hiatus: "bg-amber-500",
};

function formatDateShort(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function TitleCard({ title }: { title: Title }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white transition duration-200 hover:ring-1 hover:ring-emerald-500/60 dark:bg-white/[0.04] dark:hover:ring-emerald-400/60">
      <Link href={`/judul/${title.slug}`} className="block">
        <CoverArt
          slug={title.slug}
          title={title.title}
          overlay="catalog"
          platform={title.links[0]?.platform}
          episodes={title.episodes}
          className="rounded-t-2xl"
        />
        <div className="p-3">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${STATUS_STYLE[title.status]}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[title.status]}`} />
              {STATUS_LABEL[title.status]}
            </span>
            <span className="text-slate-500 dark:text-zinc-400">{title.year}</span>
            {title.updatedAt && (
              <span className="ml-auto text-slate-500 dark:text-zinc-400">
                {formatDateShort(title.updatedAt)}
              </span>
            )}
          </div>
          <h3 className="mt-2 line-clamp-1 font-bold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-300">
            {title.title}
          </h3>
          <p className="mt-1.5 flex flex-wrap gap-1.5">
            {title.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-white/5 dark:text-zinc-300"
              >
                {g}
              </span>
            ))}
          </p>
        </div>
      </Link>
      <QuickAddButton slug={title.slug} title={title.title} />
    </article>
  );
}
