"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";

// 1분을 밀리초로 변환
const ONE_MINUTE = 60 * 1000;

export default function Providers({ children }: { children: ReactNode }) {
  // TanStack Query가 서버 데이터와 캐시를 관리하도록 설정
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 데이터를 가져온 후 1분 동안 최신 데이터로 취급
            staleTime: ONE_MINUTE,
          },
        },
      }),
  );

  // 브라우저에서만 localStorage에 저장된 상태 복원
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    void useBookmarkStore.persist.rehydrate();
  }, []);

  return (
    // 모든 페이지에서 TanStack Query를 사용할 수 있도록 연결
    <QueryClientProvider client={queryClient}>
      {children}

      {/* 캐시와 API 요청 상태를 확인하는 개발자 도구 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
