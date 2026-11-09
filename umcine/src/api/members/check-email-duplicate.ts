import { apiClient } from "../api-client";

// 이메일 중복 확인 API의 응답 타입
export interface CheckEmailDuplicateResponse {
  available: boolean;
}

// 서버에 이메일 중복 확인 GET 요청
export function checkEmailDuplicate(email: string) {
  return apiClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckEmailDuplicateResponse>();
}
