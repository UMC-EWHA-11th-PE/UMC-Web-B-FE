import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "../pages/auth/login-page";

// /login 주소에서 로그인 페이지 표시
export const Route = createFileRoute("/login")({
  component: LoginPage,
});
