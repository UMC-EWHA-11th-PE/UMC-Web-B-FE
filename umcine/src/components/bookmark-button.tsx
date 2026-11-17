
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFavorite,
  deleteFavorite,
  getMyFavorites,
} from "../api/favorites/favorite-api";
import { useAuthStore } from "../stores/auth-store";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const queryClient = useQueryClient();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = Boolean(accessToken);

  // DB에 저장된 즐겨찾기 목록 조회
  const { data: favorites = [], isPending: isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getMyFavorites,
    enabled: isLoggedIn,
  });

  // 현재 영화의 즐겨찾기 정보
  const favorite = favorites.find(
    (item) => item.movieId === movieId,
  );

  const isBookmarked = Boolean(favorite);

  // 즐겨찾기 등록
  const createMutation = useMutation({
    mutationFn: () => createFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
    onError: () => {
      alert("즐겨찾기 등록에 실패했습니다.");
    },
  });

  // 즐겨찾기 삭제
  const deleteMutation = useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
    onError: () => {
      alert("즐겨찾기 삭제에 실패했습니다.");
    },
  });

  const isMutating =
    createMutation.isPending || deleteMutation.isPending;

  const handleBookmark = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    if (isMutating || isLoading) return;

    if (favorite) {
      deleteMutation.mutate(favorite.favoriteId);
    } else {
      createMutation.mutate();
    }
  };

  return (
    <button
      type="button"
      onClick={handleBookmark}
      disabled={isMutating || (isLoggedIn && isLoading)}
    >
      {isMutating
        ? "처리 중..."
        : isBookmarked
          ? "북마크 해제"
          : "북마크 추가"}
    </button>
  );
}
