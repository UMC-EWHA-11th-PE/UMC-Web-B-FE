import { useQuery } from "@tanstack/react-query";
import { getFavorite } from "../api/favorites/get-favorite";
import { useAuthStore } from "../stores/auth-store";

// 특정 영화의 즐겨찾기 여부를 서버에서 조회하는 Hook
export const useFavoriteQuery = (movieId: number) => {
  // 로그인 여부 확인
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    // 영화마다 별도의 캐시를 사용
    queryKey: ["favorites", movieId],

    // GET /favorites/{movieId} API 호출
    queryFn: () => getFavorite(movieId),

    // 로그인한 사용자이고 유효한 영화 ID가 있을 때만 요청
    enabled: !!accessToken && movieId > 0,

    // 데이터를 5분 동안 신선한 상태로 유지
    staleTime: 5 * 60 * 1000,

    // 현재 BE에 즐겨찾기 API가 없으므로 재시도하지 않음
    retry: false,
  });
};
