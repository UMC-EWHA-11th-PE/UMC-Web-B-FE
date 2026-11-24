import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFavorite } from "../api/favorites/create-favorite";

// 즐겨찾기 등록 시 전달받는 데이터
interface CreateFavoriteVariables {
  movieId: number;
  movieTitle: string;
}

// 즐겨찾기 등록 API를 실행하는 Hook
export const useCreateFavoriteMutation = () => {
  // TanStack Query의 캐시를 관리하는 객체
  const queryClient = useQueryClient();

  return useMutation({
    // POST /favorites API 호출 (서버에는 영화 ID만 전달)
    mutationFn: ({ movieId }: CreateFavoriteVariables) =>
      createFavorite(movieId),

    // 즐겨찾기 등록에 성공했을 때 실행
    onSuccess: async (_data, { movieTitle }) => {
      // 즐겨찾기 목록과 영화별 즐겨찾기 여부 캐시를 무효화
      await queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });

      // 등록 성공 메시지 표시
      alert(`'${movieTitle}'을(를) 즐겨찾기에 추가했습니다.`);
    },

    // 즐겨찾기 등록에 실패했을 때 실행
    onError: () => {
      alert("즐겨찾기 등록에 실패했습니다.");
    },
  });
};
