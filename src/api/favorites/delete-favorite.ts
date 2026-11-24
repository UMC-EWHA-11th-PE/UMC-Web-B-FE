
import { authApi } from "../auth-api";

interface DeleteFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}

export async function deleteFavorite(
  movieId: number
): Promise<null> {
  const response = await authApi
    .delete(`favorites/${movieId}`)
    .json<DeleteFavoriteResponse>();

  return response.result;
}
