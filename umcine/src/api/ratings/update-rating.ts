import { authApi } from "../auth-api";
import type { UpdateRatingRequest } from "./rating-types";

// 수정할 평점 ID와 새로운 내용을 함께 전달
export interface UpdateRatingVariables {
  ratingId: number;
  request: UpdateRatingRequest;
}

// PATCH /ratings/{ratingId}
export const updateRating = async ({
  ratingId,
  request,
}: UpdateRatingVariables): Promise<void> => {
  await authApi.patch(`ratings/${ratingId}`, {
    json: request,
  });
};
