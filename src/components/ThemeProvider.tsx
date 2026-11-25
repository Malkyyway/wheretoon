"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeChoice = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "wheretoon:theme";

function resolveChoice(choice: ThemeChoice): ResolvedTheme {
  if (choice === "dark") return "dark";
  if (choice === "light") return "light";
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "dark";
}

function applyResolved(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

const ThemeContext = createContext<{
  choice: ThemeChoice;
  resolved: ResolvedTheme;
  setChoice: (choice: ThemeChoice) => void;
}>({
  choice: "dark",
  resolved: "dark",
  setChoice: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>("dark");
  const [resolved, setResolved] = useState<ResolvedTheme>("dark");

  // Sinkron dari localStorage saat mount (script inline di layout sudah
  // memasang class .dark lebih dulu, jadi tidak ada kilatan tema).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeChoice | null;
      const initial: ThemeChoice =
        stored === "light" || stored === "dark" || stored === "system"
          ? stored
          : "dark";
      setChoiceState(initial);
      setResolved(applyResolvedSafe(initial));
    } catch {
      // localStorage tidak tersedia: tetap gelap
    }
  }, []);

  // Ikuti perubahan preferensi sistem saat pilihan "system" aktif.
  useEffect(() => {
    if (choice !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setResolved(applyResolvedSafe("system"));
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [choice]);

  const setChoice = useCallback((next: ThemeChoice) => {
    setChoiceState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // abaikan
    }
    setResolved(applyResolvedSafe(next));
  }, []);

  return (
    <ThemeContext.Provider value={{ choice, resolved, setChoice }}>
      {children}
    </ThemeContext.Provider>
  );
}

function applyResolvedSafe(choice: ThemeChoice): ResolvedTheme {
  const resolved = resolveChoice(choice);
  applyResolved(resolved);
  return resolved;
}
