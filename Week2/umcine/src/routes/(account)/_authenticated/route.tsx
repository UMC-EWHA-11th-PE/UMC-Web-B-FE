import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { readToken } from "@/api/session";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/(account)/_authenticated")({
  beforeLoad: () => { //토큰 검사
    const token = useAuthStore.getState().accessToken;

    if (!readToken(token)) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,//통과하면 outlet 자리에 현재 주소에 해당하는 자식 페이지가 렌더링됨
});