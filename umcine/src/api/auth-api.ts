import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

// 기존 API 설정을 유지하면서 JWT 인증 기능 추가
export const authApi = apiClient.extend({
  hooks: {
    // 서버에 요청을 보내기 전에 실행
    beforeRequest: [
      ({ request }) => {
        // Zustand에서 현재 저장된 JWT 토큰 가져오기
        const accessToken = useAuthStore.getState().accessToken;

        // 토큰이 있으면 Authorization 헤더에 추가
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],

    // 서버 응답을 받은 뒤 실행
    afterResponse: [
      ({ response }) => {
        // 인증 실패(401) 시 저장된 토큰 삭제
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
