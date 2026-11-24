import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFavorite } from "../api/favorites/delete-favorite";

// 즐겨찾기 삭제 시 전달받는 데이터
interface DeleteFavoriteVariables {
  movieId: number;
  movieTitle: string;
}

// 즐겨찾기 삭제 API를 실행하는 Hook
export const useDeleteFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // DELETE /favorites/{movieId} API 호출
    mutationFn: ({ movieId }: DeleteFavoriteVariables) =>
      deleteFavorite(movieId),

    // 삭제 성공 시 즐겨찾기 관련 캐시 무효화
    onSuccess: async (_data, { movieTitle }) => {
      await queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });

      // 영화 제목을 포함한 삭제 성공 메시지 표시
      alert(`'${movieTitle}'을(를) 즐겨찾기에서 해제했습니다.`);
    },

    onError: () => {
      alert("즐겨찾기 삭제에 실패했습니다.");
    },
  });
};
