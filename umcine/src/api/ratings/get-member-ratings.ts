import { authApi } from "../auth-api";
import type { Rating } from "./rating-types";

// GET /members/{memberId}/ratings
// 특정 회원이 작성한 평점 목록 조회
export const getMemberRatings = async (memberId: number): Promise<Rating[]> => {
  return authApi.get(`members/${memberId}/ratings`).json<Rating[]>();
};
