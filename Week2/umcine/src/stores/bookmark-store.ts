import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[]; //북마크한 영화 ID만 저장 
  toggleBookmark: (movieId: number) => void; 
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist( // persist 미들웨어를 사용하여 상태를 로컬 스토리지에 저장
    (set) => ({
      bookmarkedMovieIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",  // 로컬 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ // 저장한 데이터로 영화 ID 배열을 선택 
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
    },
  ),
);