import { createFileRoute } from "@tanstack/react-router";
import MemberTestPage from "../pages/MemberTestPage";

export const Route = createFileRoute("/member-test")({
  component: MemberTestPage,
});