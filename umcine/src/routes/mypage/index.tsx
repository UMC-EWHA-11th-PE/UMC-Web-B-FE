import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../../pages/mypage/mypage-page";

export const Route = createFileRoute("/mypage/")({
  component: MyPage,
});