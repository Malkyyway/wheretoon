"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchPalette from "./SearchPalette";
import { useTheme, type ThemeChoice } from "./ThemeProvider";

function SunIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function MonitorIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

const THEME_OPTIONS: { value: ThemeChoice; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Terang", icon: SunIcon },
  { value: "dark", label: "Gelap", icon: MoonIcon },
  { value: "system", label: "Sistem", icon: MonitorIcon },
];

function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 192 192" className={`${className} shrink-0`} role="img" aria-label="Logo WhereToon">
      <defs>
        <linearGradient
          id="wtg-header"
          x1="0"
          y1="0"
          x2="192"
          y2="192"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#10b981" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      <rect width="192" height="192" rx="44" fill="url(#wtg-header)" />
      <path
        d="M46 58 L66 134 L96 82 L126 134 L146 58"
        fill="none"
        stroke="#ffffff"
        strokeWidth="17"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M134 0 h22 v34 l-11 8 -11 -8 z" fill="#fbbf24" />
    </svg>
  );
}

function ThemeMenu() {
  const { choice, resolved, setChoice } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Pilih tema"
        aria-expanded={open}
        title="Pilih tema"
        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
      >
        {resolved === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
      {open && (
        <>
          <button
            aria-label="Tutup menu tema"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
            tabIndex={-1}
          />
          <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-zinc-900">
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = choice === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setChoice(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-white/5"
                  }`}
                  aria-pressed={active}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{opt.label}</span>
                  {active && <CheckIcon />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const linkClass = (active: boolean) =>
    `rounded-full px-3 py-2 text-sm font-medium transition ${
      active
        ? "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/85">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <LogoMark />
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Where
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Toon
            </span>
          </span>
        </Link>

        <nav className="ml-2 flex shrink-0 items-center gap-1" aria-label="Navigasi utama">
          <Link href="/" className={linkClass(pathname === "/")}>
            Beranda
          </Link>
          <Link href="/list-saya" className={linkClass(pathname === "/list-saya")}>
            List Saya
          </Link>
        </nav>

        <div className="min-w-0 flex-1" />

        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-100/70 px-3.5 py-2 text-sm text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 sm:flex sm:max-w-md dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:border-white/20 dark:hover:bg-white/10"
          aria-label="Buka pencarian"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-4 w-4 shrink-0"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="min-w-0 flex-1 truncate text-left">Cari judul, penulis...</span>
          <kbd className="shrink-0 rounded-md border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:border-white/15 dark:bg-white/10 dark:text-zinc-400">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Buka pencarian"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:hidden dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>

        <ThemeMenu />
      </div>

      <SearchPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}
