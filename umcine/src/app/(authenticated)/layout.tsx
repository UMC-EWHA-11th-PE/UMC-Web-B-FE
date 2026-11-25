"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

// 인증 상태 복원 완료 여부를 구독
function subscribe(callback: () => void) {
  const unsubscribeStart = useAuthStore.persist.onHydrate(callback);
  const unsubscribeFinish = useAuthStore.persist.onFinishHydration(callback);

  return () => {
    unsubscribeStart();
    unsubscribeFinish();
  };
}

// 로그인한 사용자만 접근할 수 있는 공통 Layout
export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  // localStorage에서 인증 상태가 복원되었는지 확인
  const hydrated = useSyncExternalStore(
    subscribe,
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  // 인증 상태 복원이 끝난 후 로그인 여부 확인
  useEffect(() => {
    if (hydrated && !accessToken) {
      router.replace("/login");
    }
  }, [hydrated, accessToken, router]);

  // 인증 상태를 확인하는 동안 로딩 화면 표시
  if (!hydrated) {
    return <main>로그인 상태를 확인하는 중...</main>;
  }

  // 로그인하지 않은 사용자는 하위 페이지 표시하지 않음
  if (!accessToken) {
    return null;
  }

  // 인증된 사용자는 하위 페이지 표시
  return <>{children}</>;
}
