"use client";

import { useEffect, useRef, useState } from "react";

export type DropdownOption<T extends string> = { value: T; label: string };

/**
 * Dropdown custom (tombol + menu popover) pengganti <select> bawaan
 * browser. Popup <select> bawaan di-render sistem operasi dan tidak bisa
 * di-style (putih + highlight biru, janggal di tema gelap), jadi menu ini
 * digambar sendiri mengikuti tema situs: permukaan putih / #101713 gelap,
 * aksen emerald, opsi aktif ditandai centang.
 */
export default function Dropdown<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  buttonClassName = "rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white",
}: {
  value: T;
  options: DropdownOption<T>[];
  onChange: (v: T) => void;
  ariaLabel: string;
  buttonClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={`inline-flex items-center gap-2 focus:outline-none ${buttonClassName}`}
      >
        <span>{current?.label ?? value}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 shrink-0 opacity-60 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="absolute right-0 z-50 mt-2 min-w-full overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-[#101713]"
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-4 whitespace-nowrap px-3 py-2 text-left text-sm transition ${
                  active
                    ? "font-semibold text-emerald-600 dark:text-emerald-400"
                    : "text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-white/10"
                }`}
              >
                {o.label}
                {active && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 shrink-0"
                    aria-hidden
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
