import { apiClient } from './api-client';
import { unwrap, type ApiResponse } from './members/auth';
export interface Rating { ratingId: number; movieId: number; score: number; comment: string | null; createdAt: string; updatedAt: string }
export function getRatings(memberId: string) { return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>(); }
export function saveRating(movieId: number, score: number, comment: string, ratingId?: number) {
  const request = ratingId ? apiClient.patch(`members/ratings/${ratingId}`, { json: { score, comment } }) : apiClient.post('members/ratings', { json: { movieId, score, comment } });
  return unwrap(request.json<ApiResponse<Rating>>());
}
export async function deleteRating(ratingId: number) {
  const response = await apiClient.delete(`members/ratings/${ratingId}`).json<ApiResponse<null>>();
  if (!response.isSuccess) throw new Error(response.message);
}
