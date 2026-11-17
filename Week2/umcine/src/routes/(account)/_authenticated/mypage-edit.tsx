import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@/pages/auth/my-page-edit";

export const Route = createFileRoute("/(account)/_authenticated/mypage-edit")({
  component: MyPage,
});