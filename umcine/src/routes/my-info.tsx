import { createFileRoute } from "@tanstack/react-router";
import { MyInfoPage } from "../pages/my-info/my-info-page";

// /my-info 주소에서 내 정보 페이지 표시
export const Route = createFileRoute("/my-info")({
  component: MyInfoPage,
});
