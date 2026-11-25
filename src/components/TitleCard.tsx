import Link from "next/link";
import type { Title } from "@/data/titles";
import { STATUS_LABEL } from "@/data/titles";
import CoverArt from "./CoverArt";

const STATUS_STYLE: Record<string, string> = {
  ongoing: "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800",
  completed: "bg-slate-200 text-slate-700",
  hiatus: "bg-amber-100 text-amber-800",
};

export default function TitleCard({ title }: { title: Title }) {
  return (
    <Link
      href={`/judul/${title.slug}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-600/10 hover:ring-1 hover:ring-emerald-500/30"
    >
      <CoverArt slug={title.slug} title={title.title} />
      <div className="p-3">
        <div className="mb-1 flex items-center gap-2">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[title.status]}`}
          >
            {STATUS_LABEL[title.status]}
          </span>
          <span className="text-xs text-slate-500">{title.year}</span>
        </div>
        <h3 className="line-clamp-1 font-semibold text-slate-900 group-hover:text-emerald-700">
          {title.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
          {title.genres.join(" · ")}
        </p>
      </div>
    </Link>
  );
}
