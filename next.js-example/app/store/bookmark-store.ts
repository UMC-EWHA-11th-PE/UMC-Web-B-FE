import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useAuthStore } from "./auth-store";
import { readToken } from "../session";

const storageKey = "umcine-bookmarks-by-member";

type BookmarkStore = {
  byMember: Record<string, number[]>;
  ready: boolean;
  toggleBookmark: (movieId: number) => void;
};

export function bookmarkOwner(token: string | null) {
  return readToken(token)?.sub ?? "guest";
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      byMember: {},
      ready: false,

      toggleBookmark: (movieId) => {
        const owner = bookmarkOwner(useAuthStore.getState().accessToken);

        set((state) => {
          const previous = state.byMember[owner] ?? [];
          const next = previous.includes(movieId)
            ? previous.filter((id) => id !== movieId)
            : [...previous, movieId];

          return { byMember: { ...state.byMember, [owner]: next } };
        });
      },
    }),
    {
      name: storageKey,
      storage:
        typeof window === "undefined"
          ? undefined
          : createJSONStorage(() => window.localStorage),
      partialize: (state) => ({ byMember: state.byMember }),
      skipHydration: true,
    },
  ),
);

let initialization: Promise<void> | undefined;

export function initializeBookmarks() {
  initialization ??= restoreBookmarks();
  return initialization;
}

async function restoreBookmarks() {
  await useBookmarkStore.persist?.rehydrate();

  // 이전 버전의 단일 즐겨찾기 목록이 있으면 현재 사용자에게 연결합니다.
  const legacyIds = readLegacyBookmarks();

  if (legacyIds.length > 0) {
    const owner = bookmarkOwner(useAuthStore.getState().accessToken);
    useBookmarkStore.setState({
      byMember: { [owner]: legacyIds },
      ready: true,
    });
    return;
  }

  useBookmarkStore.setState({ ready: true });
}

function readLegacyBookmarks(): number[] {
  try {
    if (window.localStorage.getItem(storageKey) !== null) return [];

    const raw = window.localStorage.getItem("umcine-bookmark-store");
    const ids: unknown = raw ? JSON.parse(raw)?.state?.bookmarkedMovieIds : [];

    return Array.isArray(ids)
      ? ids.filter(
          (id): id is number =>
            typeof id === "number" && Number.isSafeInteger(id) && id > 0,
        )
      : [];
  } catch {
    return [];
  }
}