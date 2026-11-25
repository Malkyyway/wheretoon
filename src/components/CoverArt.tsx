const PALETTE = [
  "bg-gradient-to-br from-emerald-500 to-teal-700",
  "bg-gradient-to-br from-sky-500 to-indigo-600",
  "bg-gradient-to-br from-rose-500 to-orange-500",
  "bg-gradient-to-br from-violet-500 to-fuchsia-600",
  "bg-gradient-to-br from-amber-500 to-orange-600",
  "bg-gradient-to-br from-cyan-500 to-blue-600",
  "bg-gradient-to-br from-lime-500 to-emerald-600",
  "bg-gradient-to-br from-fuchsia-500 to-purple-600",
  "bg-gradient-to-br from-teal-500 to-cyan-700",
  "bg-gradient-to-br from-orange-500 to-rose-600",
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
  if (words.length === 0) return "RB";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Placeholder cover: solid color block with title initials. No hotlinked images. */
export default function CoverArt({
  slug,
  title,
  size = "md",
  className = "",
}: {
  slug: string;
  title: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const textSize =
    size === "lg" ? "text-6xl" : size === "sm" ? "text-2xl" : "text-4xl";
  return (
    <div
      className={`relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-lg ${colorFor(slug)} ${className}`}
      role="img"
      aria-label={`Cover ${title}`}
    >
      <span className={`font-extrabold tracking-tight text-white ${textSize}`}>
        {initials(title)}
      </span>
      <span className="absolute bottom-2 left-2 rounded bg-black/25 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
        Manhwa
      </span>
    </div>
  );
}
