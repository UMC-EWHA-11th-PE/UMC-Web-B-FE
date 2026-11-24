import { authApi } from "../auth-api";

// DELETE /favorites/{movieId}
// 로그인한 사용자의 즐겨찾기 목록에서 영화 삭제
export const deleteFavorite = async (movieId: number): Promise<void> => {
  // 영화 ID를 URL에 포함해 즐겨찾기 삭제 요청
  await authApi.delete(`favorites/${movieId}`);
};
