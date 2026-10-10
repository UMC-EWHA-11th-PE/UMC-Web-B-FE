import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  //숫자 ID를 받아 북마크를 변경하는 함수
  toggleBookmark: (movieId: number) => void;
}

// create는 Zustand의 store를 만드는 함수
// <BookmarkStore>은 앞에서 정의한 타입 지정
// set은 store의 상태를 변경하는 함수
export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      // 처음에는 북마크된 영화가 없으므로 빈 배열로 시작
      bookmarkedMovieIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          // 현재 배열에 해당 ID(ex. 2)가 있는지 확인
          // => 있다면 2를 제외한 나머지 ID만 남겨서 북마크 해제
          // => 없다면 기존 배열의 값들 복사하고 마지막에 2(movieId) 추가
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      // localStorage에 저장될 key 이름
      name: "umcine-bookmark-store",
      // Zustand 상태를 localStorage에 JSON 문자열로 저장
      storage: createJSONStorage(() => localStorage),
      // store에서 북마크 ID 배열만 저장
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
    },
  ),
);
