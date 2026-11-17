
import { authApi } from "../auth-api";
import type {
  ApiResponse,
  Rating,
  CreateRatingRequest,
  UpdateRatingRequest,
} from "./rating-types";

// 특정 회원의 평점 목록 조회
export async function getMemberRatings(
  memberId: number
): Promise<Rating[]> {
  return authApi
    .get(`members/${memberId}/ratings`)
    .json<Rating[]>();
}

// 평점 등록
export async function createRating(
  request: CreateRatingRequest
): Promise<Rating> {
  const response = await authApi
    .post("ratings", { json: request })
    .json<ApiResponse<Rating>>();

  return response.result;
}

// 평점 수정
export async function updateRating(
  ratingId: number,
  request: UpdateRatingRequest
): Promise<Rating> {
  const response = await authApi
    .patch(`ratings/${ratingId}`, { json: request })
    .json<ApiResponse<Rating>>();

  return response.result;
}

// 평점 삭제
export async function deleteRating(
  ratingId: number
): Promise<void> {
  await authApi.delete(`ratings/${ratingId}`);
}
