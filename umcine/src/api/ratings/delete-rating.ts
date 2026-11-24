import { authApi } from "../auth-api";

// DELETE /ratings/{ratingId}
// 성공 시 204 No Content 반환
export const deleteRating = async (ratingId: number): Promise<void> => {
  await authApi.delete(`ratings/${ratingId}`);
};
