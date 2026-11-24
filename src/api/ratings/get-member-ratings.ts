
import { authApi } from "../auth-api";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface GetRatingsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating[];
}

export async function getMemberRatings(): Promise<Rating[]> {
  const response = await authApi
    .get("ratings")
    .json<GetRatingsResponse>();

  return response.result;
}
