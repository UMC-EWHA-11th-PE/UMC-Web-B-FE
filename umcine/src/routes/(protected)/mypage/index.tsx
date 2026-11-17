import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../../../pages/mypage/mypage-page";

export const Route = createFileRoute("/(protected)/mypage/")({
  component: MyPage,
});