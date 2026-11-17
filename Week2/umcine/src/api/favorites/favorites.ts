import { authApi } from "@/stores/auth-api";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createAt: string;
}

export interface FavoriteStatusResponse {
  isFavorite: boolean;
}

interface FavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite[];
}

export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<FavoritesResponse>();

  if (!response.isSuccess) {
    throw new Error(response.message);
  }

  return response.result;
}

interface FavoriteActionResponse {
  isSuccess: boolean;
  message: string;
}

interface FavoriteStatusApiResponse extends FavoriteActionResponse {
  result: FavoriteStatusResponse;
}

export async function getFavoriteStatus(movieId: number): Promise<boolean> {
  const response = await authApi
    .get("favorites/" + movieId)
    .json<FavoriteStatusApiResponse>();

  if (!response.isSuccess) {
    throw new Error(response.message);
  }

  return response.result.isFavorite;
}

export async function addFavorite(movieId: number): Promise<void> {
  const response = await authApi.post("favorites", {
    json: { movieId },
  });

  await checkFavoriteAction(response);
}

export async function deleteFavorite(movieId: number): Promise<void> {
  const response = await authApi.delete("favorites/" + movieId);

  await checkFavoriteAction(response);
}

async function checkFavoriteAction(response: Response): Promise<void> {
  if (response.status === 204) return;

  const body = (await response.json()) as FavoriteActionResponse;
  if (!body.isSuccess) {
    throw new Error(body.message);
  }
}
