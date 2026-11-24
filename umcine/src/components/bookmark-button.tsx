import { useBookmarkStore } from "../stores/bookmark-store";
import { useAuthStore } from "../stores/auth-store";
import { useFavoriteQuery } from "../hooks/use-favorite-query";
import { useCreateFavoriteMutation } from "../hooks/use-create-favorite-mutation";
import { useDeleteFavoriteMutation } from "../hooks/use-delete-favorite-mutation";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string; // 성공 알림에 표시할 영화 제목
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  className,
}: BookmarkButtonProps) {
  // 로그인 여부 확인
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken;

  // 기존 Zustand 북마크 상태 가져오기
  const localIsBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  // 기존 Zustand 북마크 변경 함수
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  // 로그인한 사용자만 서버에서 즐겨찾기 여부 조회
  const favoriteQuery = useFavoriteQuery(movieId);

  // 서버 즐겨찾기 등록 및 삭제 Mutation
  const createFavoriteMutation = useCreateFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  // 로그인 상태에 따라 서버 또는 로컬 북마크 사용
  const isBookmarked = isLoggedIn
    ? (favoriteQuery.data ?? false)
    : localIsBookmarked;

  // 서버 요청이 진행 중인지 확인
  const isPending =
    createFavoriteMutation.isPending || deleteFavoriteMutation.isPending;

  // 북마크 버튼 클릭 시 실행
  const handleBookmarkClick = () => {
    // 비로그인 상태에서는 기존 Zustand 북마크 기능 유지
    if (!isLoggedIn) {
      toggleBookmark(movieId);
      return;
    }

    // 로그인 상태에서는 영화 ID와 제목을 Mutation에 전달
    if (isBookmarked) {
      deleteFavoriteMutation.mutate({
        movieId,
        movieTitle,
      });
    } else {
      createFavoriteMutation.mutate({
        movieId,
        movieTitle,
      });
    }
  };

  return (
    <button
      // 기존 북마크 버튼 디자인 유지
      className={cn(
        "flex h-9 w-9 cursor-pointer items-center justify-center rounded-[9px] border-2 p-0",
        isBookmarked
          ? "border-blue-600 bg-blue-600"
          : "border-white bg-gray-900/90",
        className,
      )}
      type="button"
      onClick={handleBookmarkClick}
      // 서버 요청 중이거나 즐겨찾기 조회 중이면 중복 클릭 방지
      disabled={isPending || (isLoggedIn && favoriteQuery.isPending)}
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
