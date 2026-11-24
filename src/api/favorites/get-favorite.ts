
import { authApi } from "../auth-api";

export interface FavoriteResponse {
  isFavorite: boolean;
}

interface GetFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteResponse;
}

export async function getFavorite(
  movieId: number
): Promise<FavoriteResponse> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<GetFavoriteResponse>();

  return response.result;
}
