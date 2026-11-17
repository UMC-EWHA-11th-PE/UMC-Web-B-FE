
export type Rating = {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

// 평점 등록 요청
export type CreateRatingRequest = {
  movieId: number;
  score: number;
  comment: string | null;
};

// 평점 수정 요청
export type UpdateRatingRequest = {
  score: number;
  comment: string | null;
};

// 백엔드 공통 응답 형식
export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};
