import { useAuthStore } from "@/stores/auth-store";
import { readToken } from "@/api/session";
import { redirect } from "@tanstack/react-router";
import {createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@/pages/auth/my-page";

export const Route = createFileRoute("/mypage")({
  beforeLoad: () => { if (!readToken(useAuthStore.getState().accessToken)) throw redirect({ to: "/login" }); },
  component: MyPage,
});
