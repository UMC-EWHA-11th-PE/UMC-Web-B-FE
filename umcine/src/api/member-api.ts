const BASE_URL = "http://localhost:8080";

export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

// 닉네임 중복 확인
export async function checkNickname(nickname: string) {
  const response = await fetch(
    `${BASE_URL}/members/nickname/${encodeURIComponent(nickname)}`
  );

  if (!response.ok) {
    throw new Error("닉네임 중복 확인 실패");
  }

  return response.json();
}

// 이메일 중복 확인
export async function checkEmail(email: string) {
  const response = await fetch(
    `${BASE_URL}/members/email/${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    throw new Error("이메일 중복 확인 실패");
  }

  return response.json();
}

// 사용자 평점 조회
export async function getMemberRatings(memberId: number) {
  const response = await fetch(
    `${BASE_URL}/members/${memberId}/ratings`
  );

  if (!response.ok) {
    throw new Error("평점 조회 실패");
  }

  return response.json();
}