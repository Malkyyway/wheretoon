import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wheretoon.vercel.app"),
  title: {
    default: "WhereToon - Cari & Lacak Manhwa Legal",
    template: "%s | WhereToon",
  },
  description:
    "WhereToon membantu kamu menemukan manhwa di platform resmi (WEBTOON, Tappytoon, dan lainnya) dan melacak progres bacaanmu. Tanpa konten bajakan.",
  keywords: [
    "manhwa",
    "baca manhwa legal",
    "webtoon",
    "tappytoon",
    "tracker manhwa",
    "wheretoon",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.svg",
    apple: "/icon-192.svg",
  },
  openGraph: {
    type: "website",
    siteName: "WhereToon",
    title: "WhereToon - Cari & Lacak Manhwa Legal",
    description:
      "Temukan manhwa di platform resmi dan lacak progres bacaanmu di satu tempat.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <svg
                viewBox="0 0 192 192"
                className="h-9 w-9 shrink-0"
                role="img"
                aria-label="Logo WhereToon"
              >
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
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Where
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Toon
                </span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm font-medium" aria-label="Navigasi utama">
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                Beranda
              </Link>
              <Link
                href="/list-saya"
                className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                List Saya
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>

        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
            <p className="font-semibold text-slate-700">WhereToon</p>
            <p className="mt-1">
              Agregator manhwa legal - kami tidak menyimpan konten berhak cipta.
              Semua link membaca mengarah ke platform resmi (WEBTOON, Tappytoon).
              Dukung kreator dengan membaca di sumber resmi.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
