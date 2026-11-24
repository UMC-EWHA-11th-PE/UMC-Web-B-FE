import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../../pages/my-info/my-page";

// 로그인한 사용자만 접근할 수 있는 마이페이지
export const Route = createFileRoute("/(_authenticated)/my-page")({
  component: MyPage,
});
