
import { authApi } from "../auth-api";
import type { Rating } from "./get-member-ratings";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

interface CreateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}

export async function createRating(
  data: CreateRatingRequest
): Promise<Rating> {
  const response = await authApi
    .post("ratings", {
      json: data,
    })
    .json<CreateRatingResponse>();

  return response.result;
}
