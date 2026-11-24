import { authApi } from "../auth-api";
import type { MemberInfo } from "./me";

// 내 정보 수정 시 서버에 전달할 데이터
export interface UpdateMeRequest {
  nickname: string;
}

// 내 정보 수정 API 응답 타입
interface UpdateMeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberInfo;
}

// JWT 인증을 이용한 내 정보 수정 API
export async function updateMe(body: UpdateMeRequest): Promise<MemberInfo> {
  // authApi가 Authorization 헤더에 JWT를 자동 추가
  const response = await authApi
    .patch("me", { json: body })
    .json<UpdateMeResponse>();

  // 수정된 회원 정보만 반환
  return response.result;
}
