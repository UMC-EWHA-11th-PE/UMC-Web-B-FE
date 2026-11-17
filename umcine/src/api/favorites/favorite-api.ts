
import { authApi } from "../../api/auth-api";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 내 즐겨찾기 목록 조회
export const getMyFavorites = async (): Promise<Favorite[]> => {
  const response = await authApi
    .get("favorites")
    .json<ApiResponse<Favorite[]>>();

  return response.result;
};

// 즐겨찾기 등록
export const createFavorite = async (
  movieId: number,
): Promise<Favorite> => {
  const response = await authApi
    .post("favorites", {
      json: { movieId },
    })
    .json<ApiResponse<Favorite>>();

  return response.result;
};

// 즐겨찾기 삭제
export const deleteFavorite = async (
  favoriteId: number,
): Promise<void> => {
  await authApi.delete(`favorites/${favoriteId}`);
};
