import { apiClient } from "../api-client";

// 로그인 요청 시 서버에 전달할 데이터 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 성공 시 서버에서 받는 응답 타입
export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    accessToken: string;
  };
}

// Spring Boot 서버에 로그인 POST 요청
export function login(body: LoginRequest) {
  return apiClient.post("auth/login", { json: body }).json<LoginResponse>();
}
