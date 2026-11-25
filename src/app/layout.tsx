import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";

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

// Dipasang sebelum render agar tema gelap (default) tidak berkedip saat muat.
const themeScript = `(function(){try{var t=localStorage.getItem("wheretoon:theme")||"dark";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-slate-900 dark:bg-zinc-950 dark:text-zinc-100">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <Navbar />

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>

          <footer className="border-t border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0a0a0b]">
            <div className="mx-auto max-w-7xl px-4 py-10">
              <div className="flex flex-col gap-8 md:flex-row md:justify-between">
                <div className="max-w-md">
                  <p className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Where
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                      Toon
                    </span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-zinc-400">
                    WhereToon adalah agregator manhwa legal - kami tidak menyimpan
                    konten berhak cipta. Semua tautan baca mengarah ke platform
                    resmi (WEBTOON, Tappytoon, Manta). Dukung kreator dengan
                    membaca di sumber resmi.
                  </p>
                </div>
                <div className="flex gap-16">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                      Jelajahi
                    </p>
                    <ul className="mt-3 space-y-2 text-sm">
                      <li>
                        <Link href="/" className="text-slate-600 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400">
                          Beranda
                        </Link>
                      </li>
                      <li>
                        <Link href="/#katalog" className="text-slate-600 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400">
                          Katalog
                        </Link>
                      </li>
                      <li>
                        <Link href="/list-saya" className="text-slate-600 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400">
                          List Saya
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                      Platform
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-zinc-300">
                      <li>WEBTOON</li>
                      <li>Tappytoon</li>
                      <li>Manta</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-zinc-500">
                <p>© 2026 WhereToon. Dibuat untuk pembaca manhwa Indonesia.</p>
                <p>Semua judul dan merek adalah milik pemegang haknya.</p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
