import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useAuthStore } from './auth-store';
import { readToken } from '@/api/session';

const owner = () => readToken(useAuthStore.getState().accessToken)?.sub ?? 'guest';
function initialBookmarks(): Record<string, number[]> {
  try {
    if (localStorage.getItem('umcine-bookmarks-by-member')) return {};
    const previous = JSON.parse(localStorage.getItem('umcine-bookmark-store') ?? 'null');
    const ids: unknown = previous?.state?.bookmarkedMovieIds;
    return Array.isArray(ids) ? { [owner()]: ids.filter((id): id is number => Number.isInteger(id) && id > 0) } : {};
  } catch { return {}; }
}
interface BookmarkStore {
  bookmarkedMovieIds: number[];
  byMember: Record<string, number[]>;
  toggleBookmark: (movieId: number) => void;
  switchMember: () => void;
}
export const useBookmarkStore = create<BookmarkStore>()(persist((set) => ({
  bookmarkedMovieIds: [],
  byMember: initialBookmarks(),
  switchMember: () => set(state => ({ bookmarkedMovieIds: state.byMember[owner()] ?? [] })),
  toggleBookmark: movieId => set(state => {
    const key = owner();
    const previous = state.byMember[key] ?? [];
    const ids = previous.includes(movieId) ? previous.filter(id => id !== movieId) : [...previous, movieId];
    return { bookmarkedMovieIds: ids, byMember: { ...state.byMember, [key]: ids } };
  }),
}), {
  name: 'umcine-bookmarks-by-member',
  storage: createJSONStorage(() => localStorage),
  partialize: state => ({ byMember: state.byMember }),
}));
useBookmarkStore.getState().switchMember();
useAuthStore.subscribe(() => useBookmarkStore.getState().switchMember());
