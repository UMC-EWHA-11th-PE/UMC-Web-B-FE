import { authApi } from "../auth-api";

// 특정 영화 하나를 찜했는지 확인
// 즐겨찾기 여부를 반환하는 응답 타입
interface GetFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: boolean;
}

// GET /favorites/{movieId}
// 특정 영화가 즐겨찾기에 등록되어 있는지 조회
export const getFavorite = async (movieId: number): Promise<boolean> => {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<GetFavoriteResponse>();

  // 즐겨찾기 여부(true 또는 false) 반환
  return response.result;
};
