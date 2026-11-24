import { authApi } from "../auth-api";

// 즐겨찾기 등록 시 서버에 전달할 데이터
interface CreateFavoriteRequest {
  movieId: number;
}

// POST /favorites
// 로그인한 사용자의 즐겨찾기 목록에 영화 추가
export const createFavorite = async (movieId: number): Promise<void> => {
  const request: CreateFavoriteRequest = {
    movieId,
  };

  // JWT를 자동으로 첨부해 즐겨찾기 등록 요청
  await authApi.post("favorites", {
    json: request,
  });
};
