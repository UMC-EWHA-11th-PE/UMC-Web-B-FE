
import { authApi } from "../auth-api";

export interface UpdateRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

export interface UpdatedRating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: UpdatedRating;
}

export async function updateRating(
  ratingId: number,
  data: UpdateRatingRequest,
): Promise<UpdatedRating> {
  const response = await authApi
    .patch(`ratings/${ratingId}`, {
      json: data,
    })
    .json<UpdateRatingResponse>();

  return response.result;
}
