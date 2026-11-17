import { apiClient } from "@/api/api-client";
import { unwrap, type ApiResponse } from '@/api/members/auth';

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

type UpdateRatingRequest = Pick<CreateRatingRequest, 'score' | 'comment'>;

export function getRatings(memberId: string): Promise<Rating[]> {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

export function createRating(body: CreateRatingRequest): Promise<Rating> {
  return unwrap(
    apiClient.post('members/ratings', { json: body }).json<ApiResponse<Rating>>(),
  );
}

export function updateRating(
  ratingId: number,
  body: UpdateRatingRequest,
): Promise<Rating> {
  return unwrap(
    apiClient.patch(`members/ratings/${ratingId}`, { json: body }).json<ApiResponse<Rating>>(),
  );
}

export async function deleteRating(ratingId: number): Promise<void> {
  const response = await apiClient.delete(`members/ratings/${ratingId}`);

  if (response.status === 204) return;

  const body = (await response.json()) as ApiResponse<null>;
  if (!body.isSuccess) {
    throw new Error(body.message || '평점을 삭제하지 못했어요.');
  }
}
