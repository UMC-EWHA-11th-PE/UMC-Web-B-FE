import { authApi } from "../auth-api";

// 특정 영화 하나를 찜했는지 확인
// 백엔드 응답 형식에 따른 즐겨찾기 응답 타입
interface GetFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result:
    | boolean
    | {
        isFavorite?: boolean;
        favorite?: boolean;
      };
}

// GET /favorites/{movieId}
// 특정 영화가 즐겨찾기에 등록되어 있는지 조회
export const getFavorite = async (movieId: number): Promise<boolean> => {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<GetFavoriteResponse>();

  const result = response.result;

  // 서버에서 boolean을 직접 반환하는 경우
  if (typeof result === "boolean") {
    return result;
  }

  // 서버에서 객체 형태로 반환하는 경우
  if (result && typeof result === "object") {
    return result.isFavorite === true || result.favorite === true;
  }

  // 예상하지 못한 응답 형식인 경우
  console.warn("즐겨찾기 응답 형식 확인 필요:", result);

  return false;
};
