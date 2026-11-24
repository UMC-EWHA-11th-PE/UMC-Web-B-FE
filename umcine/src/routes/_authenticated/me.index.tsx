import { createFileRoute } from "@tanstack/react-router";
import { MyInfoPage } from "../../pages/me/my-info-page";

export const Route = createFileRoute("/_authenticated/me/")({
  component: MyInfoPage,
});
