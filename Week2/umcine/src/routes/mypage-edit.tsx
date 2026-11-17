import { useAuthStore } from "@/stores/auth-store";
import { readToken } from "@/api/session";
import { redirect } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@/pages/auth/my-page-edit";

export const Route = createFileRoute("/mypage-edit")({
  beforeLoad: () => { if (!readToken(useAuthStore.getState().accessToken)) throw redirect({ to: "/login" }); },
  component: MyPage,
});
