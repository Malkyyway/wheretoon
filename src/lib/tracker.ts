export type ListStatus = "reading" | "plan" | "completed";

export interface ListEntry {
  slug: string;
  status: ListStatus;
  chapter: number;
  updatedAt: number;
}

export type ReadingList = Record<string, ListEntry>;

export const STORAGE_KEY = "wheretoon:list";

export const STATUS_LABEL_ID: Record<ListStatus, string> = {
  reading: "Lagi dibaca",
  plan: "Mau dibaca",
  completed: "Selesai",
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadList(): ReadingList {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as ReadingList;
    return {};
  } catch {
    return {};
  }
}

export function saveList(list: ReadingList): void {
  cachedList = list;
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // storage penuh / tidak tersedia: abaikan
  }
  notifyListChanged();
}

/** --- useSyncExternalStore bridge (agar komponen selalu sinkron) --- */

let cachedList: ReadingList | null = null;

export function subscribeList(onChange: () => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = () => {
    cachedList = null;
    onChange();
  };
  window.addEventListener("storage", handler);
  window.addEventListener("wheretoon:list-changed", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("wheretoon:list-changed", handler);
  };
}

export function getListSnapshot(): ReadingList {
  if (cachedList) return cachedList;
  cachedList = loadList();
  return cachedList;
}

/** Satu objek kosong yang dipakai bersama - lihat getListServerSnapshot. */
const EMPTY_LIST: ReadingList = {};

export function getListServerSnapshot(): ReadingList {
  // Harus objek yang SAMA di setiap panggilan: React membandingkan referensi
  // hasil getServerSnapshot antar render, dan object literal baru `{}` di tiap
  // panggilan memicu warning "getServerSnapshot should be cached" + risiko
  // loop render (terlihat di QuickAddButton saat `npm run dev`).
  return EMPTY_LIST;
}

export function notifyListChanged(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event("wheretoon:list-changed"));
}

export function getEntry(list: ReadingList, slug: string): ListEntry | undefined {
  return list[slug];
}

export function upsertEntry(
  list: ReadingList,
  slug: string,
  patch: Partial<Omit<ListEntry, "slug">>,
): ReadingList {
  const prev = list[slug] ?? { slug, status: "plan" as ListStatus, chapter: 0, updatedAt: Date.now() };
  return {
    ...list,
    [slug]: { ...prev, ...patch, slug, updatedAt: Date.now() },
  };
}

export function removeEntry(list: ReadingList, slug: string): ReadingList {
  const next = { ...list };
  delete next[slug];
  return next;
}

export function setChapter(list: ReadingList, slug: string, chapter: number): ReadingList {
  const safe = Math.max(0, Math.floor(chapter) || 0);
  return upsertEntry(list, slug, { chapter: safe });
}

export function countByStatus(list: ReadingList): Record<ListStatus, number> {
  const counts: Record<ListStatus, number> = { reading: 0, plan: 0, completed: 0 };
  for (const entry of Object.values(list)) {
    counts[entry.status] += 1;
  }
  return counts;
}
