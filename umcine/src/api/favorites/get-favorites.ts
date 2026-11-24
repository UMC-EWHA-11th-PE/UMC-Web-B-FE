import { authApi } from "../auth-api";

// 내가 찜한 영화 전체 목록 가져오기
// 서버에서 반환하는 즐겨찾기 영화 정보
export interface FavoriteMovie {
  movieId: number;
}

// Spring Boot 공통 응답 형식
interface GetFavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteMovie[];
}

// GET /favorites
// 로그인한 사용자의 즐겨찾기 목록 조회
export const getFavorites = async (): Promise<FavoriteMovie[]> => {
  const response = await authApi.get("favorites").json<GetFavoritesResponse>();

  // 공통 응답에서 실제 즐겨찾기 목록만 반환
  return response.result;
};
