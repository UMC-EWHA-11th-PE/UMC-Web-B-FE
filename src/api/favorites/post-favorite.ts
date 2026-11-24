
import { authApi } from "../auth-api";

export interface PostFavoriteResult {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface PostFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: PostFavoriteResult;
}

export async function postFavorite(
  movieId: number
): Promise<PostFavoriteResult> {
  const response = await authApi
    .post("favorites", {
      json: { movieId },
    })
    .json<PostFavoriteResponse>();

  return response.result;
}
