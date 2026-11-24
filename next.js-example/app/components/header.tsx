"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";

import { readToken } from "../session";
import { useAuthStore } from "../store/auth-store";
import { useProfileStore } from "../store/profile-store";

function clearSession(queryClient: QueryClient) {
  useAuthStore.getState().clearAuth();
  useProfileStore.setState({ profile: null });
  queryClient.removeQueries({ queryKey: ["members"] });
  queryClient.removeQueries({ queryKey: ["ratings"] });
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.accessToken);
  const loggedIn = readToken(token) !== null;

  useEffect(() => {
    if (!token) return;

    // 창을 열어 둔 동안에도 토큰이 만료되면 로그인 메뉴를 갱신합니다.
    let timer: number;

    function scheduleExpiry() {
      if (useAuthStore.getState().accessToken !== token) return;

      const claims = readToken(token);
      if (!claims) {
        clearSession(queryClient);
        return;
      }

      const remaining = claims.exp * 1000 - Date.now();
      timer = window.setTimeout(
        scheduleExpiry,
        Math.min(Math.max(0, remaining), 2_147_483_647),
      );
    }

    scheduleExpiry();
    return () => window.clearTimeout(timer);
  }, [token, queryClient]);

  function handleLogout() {
    clearSession(queryClient);
    router.replace("/login");
  }

  const moviesActive = pathname === "/" || pathname.startsWith("/movies/");
  const searchActive = pathname === "/search";
  const myPageActive = pathname === "/mypage" || pathname === "/mypage-edit";

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white text-slate-900">
      <div className="mx-auto flex min-h-[72px] max-w-[1320px] flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3 sm:px-5">
        <Link href="/" aria-label="UMCine 홈" className="text-xl font-extrabold">
          UMCine
        </Link>

        <nav aria-label="주 메뉴" className="flex flex-wrap items-center gap-4 text-sm font-semibold">
          <MenuLink href="/" active={moviesActive}>영화</MenuLink>
          <MenuLink href="/search" active={searchActive}>검색</MenuLink>
          {loggedIn && (
            <MenuLink href="/mypage" active={myPageActive}>내 정보</MenuLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3 text-xs font-bold">
          {loggedIn ? (
            <button type="button" onClick={handleLogout} className="hover:text-blue-600">
              로그아웃
            </button>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-600">로그인</Link>
              <Link href="/signup" className="hover:text-blue-600">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "text-slate-900 underline underline-offset-4"
          : "text-slate-500 hover:text-blue-600"
      }
    >
      {children}
    </Link>
  );
}