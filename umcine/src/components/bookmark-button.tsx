import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  className?: string;
}

export function BookmarkButton({ movieId, className }: BookmarkButtonProps) {
  //Zustand에서 현재 영화가 북마크되어 있는지 확인
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  //Zustand에서 북마크 상태를 변경하는 함수 가져오기
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      //북마크 안 되어 있으면 bookmark-button , 북마크 되어 있으면 bookmark-button bookmarked
      className={cn(
        "flex h-9 w-9 cursor-pointer items-center justify-center rounded-[9px] border-2 p-0",
        isBookmarked
          ? "border-blue-600 bg-blue-600"
          : "border-white bg-gray-900/90",
        className,
      )}
      type="button"
      onClick={() => toggleBookmark(movieId)}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
    >
      <img
        className="h-5 w-5 brightness-0 invert"
        src={
          isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"
        }
        alt=""
      />
    </button>
  );
}
