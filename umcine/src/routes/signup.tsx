import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "../pages/auth/signup-page";

// /signup 주소로 접속하면 SignupPage 컴포넌트를 보여줌
export const Route = createFileRoute("/signup")({
  component: SignupPage,
});
