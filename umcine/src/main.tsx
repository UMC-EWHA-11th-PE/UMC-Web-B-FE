import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({ routeTree });

//TypeScript에게 router의 타입을 알려주는 부분
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

//실제 React 앱을 실행하는 부분
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);