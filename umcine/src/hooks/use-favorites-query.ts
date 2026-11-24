import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../api/favorites/get-favorites";
import { useAuthStore } from "../stores/auth-store";

// 로그인한 사용자의 즐겨찾기 목록을 서버에서 조회하는 Hook
export const useFavoritesQuery = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    // 즐겨찾기 목록을 구분하는 캐시 키
    queryKey: ["favorites"],

    // GET /favorites API 호출
    queryFn: getFavorites,

    // 로그인한 경우에만 API 요청
    enabled: !!accessToken,

    // 데이터가 5분 동안 신선하다고 판단
    staleTime: 5 * 60 * 1000,

    // 실패 시 재시도하지 않음
    retry: false,
  });
};
