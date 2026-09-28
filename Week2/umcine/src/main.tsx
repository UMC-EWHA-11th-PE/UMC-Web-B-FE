import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({ routeTree });

// Link에서 실제 라우트와 params 타입을 알 수 있도록 등록
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);