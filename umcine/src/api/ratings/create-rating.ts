import { authApi } from "../auth-api";
import type { CreateRatingRequest } from "./rating-types";

interface CreateRatingResponse {
  result: number;
}

// POST /ratings
// JWT에서 로그인한 회원 ID를 확인하므로 memberId는 전달하지 않음
export const createRating = async (
  request: CreateRatingRequest,
): Promise<number> => {
  const response = await authApi
    .post("ratings", {
      json: request,
    })
    .json<CreateRatingResponse>();

  // 새로 등록된 평점 ID 반환
  return response.result;
};
