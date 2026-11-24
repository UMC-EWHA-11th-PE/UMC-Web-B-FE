import { apiClient } from "../api-client";

// 닉네임 중복 확인 API의 응답 타입
export interface CheckNicknameDuplicateResponse {
  available: boolean;
}

// 서버에 닉네임 중복 확인 GET 요청
export function checkNicknameDuplicate(nickname: string) {
  return apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckNicknameDuplicateResponse>();
}
