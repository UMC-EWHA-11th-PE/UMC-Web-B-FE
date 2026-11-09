import { apiClient } from "../api-client";

// 회원가입 API에 전달할 요청 데이터
export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

// 회원가입 API에서 반환하는 응답 데이터
export interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
    email: string;
    nickname: string;
  };
}

// Spring Boot 서버에 회원가입 POST 요청
export function signup(body: SignupRequest) {
  return apiClient.post("members", { json: body }).json<SignupResponse>();
}
