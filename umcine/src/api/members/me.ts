import { authApi } from "../auth-api";

// 서버에서 반환하는 회원 정보 타입
export interface MemberInfo {
  memberId: number; // 회원 고유 ID
  email: string; // 이메일
  nickname: string; // 닉네임
  createdAt: string; // 가입일
}

// 내 정보 조회 API 응답 타입
interface MeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberInfo;
}

// JWT 인증을 이용한 내 정보 조회
export async function getMe(): Promise<MemberInfo> {
  // authApi가 Authorization 헤더에 JWT를 자동 추가
  const response = await authApi.get("me").json<MeResponse>();

  // 서버 응답에서 실제 회원 정보만 반환
  return response.result;
}
