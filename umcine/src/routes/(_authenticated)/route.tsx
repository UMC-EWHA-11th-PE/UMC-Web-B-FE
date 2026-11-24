import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// 로그인한 사용자만 접근할 수 있는 공통 Layout Route
export const Route = createFileRoute("/(_authenticated)")({
  // 하위 페이지를 표시하기 전에 로그인 상태 확인
  beforeLoad: () => {
    const accessToken = useAuthStore.getState().accessToken;

    // JWT가 없으면 로그인 페이지로 이동
    if (!accessToken) {
      throw redirect({ to: "/login" });
    }
  },

  // 인증된 사용자는 하위 페이지를 표시
  component: () => <Outlet />,
});
