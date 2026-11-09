import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({ routeTree });

//1분을 밀리초로 변환
const ONE_MINUTE = 60 * 1000;

// Tanstack Query가 서버 데이터와 캐시를 관리하도록 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //데이터를 가져온 후 1분 동안 최신 데이터로 취급
      staleTime: ONE_MINUTE,
    },
  },
});

//TypeScript에게 router의 타입을 알려주는 부분
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

//실제 React 앱을 실행하는 부분
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 모든 페이지에서 TanStack Query를 사용할 수 있도록 연결 */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      {/* 캐시와 API 요청 상태를 확인하는 개발자 도구 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
