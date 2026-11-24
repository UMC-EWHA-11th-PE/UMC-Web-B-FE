import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../pages/auth/login-page";
import { useAuthStore } from "../stores/auth-store";

// /login 주소에서 로그인 페이지 표시
export const Route = createFileRoute("/login")({
  // 로그인 페이지를 표시하기 전에 JWT 저장 여부 확인
  beforeLoad: () => {
    const accessToken = useAuthStore.getState().accessToken;

    // 이미 로그인한 사용자는 메인 페이지로 이동
    if (accessToken) {
      throw redirect({ to: "/" });
    }
  },

  component: LoginPage,
});
