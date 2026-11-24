// 평점 조회 응답 타입
// BE의 RatingResponse.java와 동일한 구조
export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

// 평점 등록 요청 타입
// BE의 CreateRatingRequest.java와 동일한 구조
export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string | null;
}

// 평점 수정 요청 타입
// BE의 UpdateRatingRequest.java와 동일한 구조
export interface UpdateRatingRequest {
  score: number;
  comment?: string | null;
}
