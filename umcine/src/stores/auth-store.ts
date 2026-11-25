"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 인증 상태와 토큰 변경 함수의 타입 정의
interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // 초기 상태는 로그인하지 않은 상태
      accessToken: null,

      // 로그인 시 토큰 저장, 로그아웃 시 null로 변경
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      // localStorage에 저장할 이름
      name: "umcine-auth-store",

      // 브라우저에서만 localStorage에 접근
      storage: createJSONStorage(() => localStorage),

      // 서버 렌더링 중에는 저장된 상태를 복원하지 않음
      skipHydration: true,

      // accessToken만 저장하도록 설정
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
    },
  ),
);
