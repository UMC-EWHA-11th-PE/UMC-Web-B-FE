import { createFileRoute } from "@tanstack/react-router";
import { MyPageEdit } from "../../../pages/mypage/mypage-edit-page";

export const Route = createFileRoute("/(protected)/mypage/edit")({
  component: MyPageEdit,
});