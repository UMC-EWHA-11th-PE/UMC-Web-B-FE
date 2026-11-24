"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { LoginPage } from "@/views/auth/login-page";

// Zustand 인증 상태 복원 여부 구독
function subscribe(callback: () => void) {
  const unsubscribeStart = useAuthStore.persist.onHydrate(callback);
  const unsubscribeFinish = useAuthStore.persist.onFinishHydration(callback);

  return () => {
    unsubscribeStart();
    unsubscribeFinish();
  };
}

export default function LoginGuard() {
  const router = useRouter();

  // Zustand에 저장된 JWT 확인
  const accessToken = useAuthStore((state) => state.accessToken);

  // localStorage의 인증 상태 복원 완료 여부 확인
  const hydrated = useSyncExternalStore(
    subscribe,
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  // 이미 로그인한 사용자는 메인 페이지로 이동
  useEffect(() => {
    if (hydrated && accessToken) {
      router.replace("/");
    }
  }, [hydrated, accessToken, router]);

  // 인증 상태 확인 중
  if (!hydrated) {
    return <main>로그인 상태를 확인하는 중...</main>;
  }

  // 이미 로그인한 사용자에게 로그인 화면을 표시하지 않음
  if (accessToken) {
    return null;
  }

  // 로그인하지 않은 사용자에게 로그인 화면 표시
  return <LoginPage />;
}
