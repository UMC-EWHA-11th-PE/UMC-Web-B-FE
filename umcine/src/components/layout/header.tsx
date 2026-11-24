// <a>는 일반적인 웹 링크이고,
// Link는 TanStack Router에게 페이지 이동을 맡기는 컴포넌트
// 즉 React 앱 자체를 유지하면서: / -> /search 처럼 화면 바꾸는거 가능

import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  // Zustand에 저장된 JWT 확인
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // TanStack Query 캐시 관리
  const queryClient = useQueryClient();

  // JWT가 있을 때만 서버에 내 정보 조회 요청
  const { data: member } = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: !!accessToken,

    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 로그아웃 시 JWT와 기존 회원 정보 캐시 삭제
  const handleLogout = () => {
    setAccessToken(null);
    queryClient.removeQueries({
      queryKey: ["members", "me"],
    });

    queryClient.removeQueries({
      queryKey: ["favorites"],
    });

    queryClient.removeQueries({
      queryKey: ["ratings"],
    });
  };

  return (
    <header className="h-[72px] w-full border-b border-[#eeeeee] bg-white">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-12">
          <Link
            className="flex items-center gap-2 text-xl font-bold text-[#111111] no-underline"
            to="/"
          >
            <img className="h-7 w-7" src="/icons/movie.svg" alt="" />
            <span>UMCine</span>
          </Link>

          <nav className="flex items-center gap-8">
            {/* 현재 영화 페이지일 때만 밑줄 표시 */}
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{
                className:
                  "text-sm font-semibold text-[#111111] underline underline-offset-8",
              }}
              inactiveProps={{
                className: "text-sm text-[#666666] no-underline",
              }}
            >
              영화
            </Link>

            {/* 현재 검색 페이지일 때만 밑줄 표시 */}
            <Link
              to="/search"
              activeProps={{
                className:
                  "text-sm font-semibold text-[#111111] underline underline-offset-8",
              }}
              inactiveProps={{
                className: "text-sm text-[#666666] no-underline",
              }}
            >
              검색
            </Link>

            {/* 현재 내 정보 페이지일 때만 밑줄 표시 */}
            <Link
              to="/my-page"
              activeProps={{
                className:
                  "text-sm font-semibold text-[#111111] underline underline-offset-8",
              }}
              inactiveProps={{
                className: "text-sm text-[#666666] no-underline",
              }}
            >
              마이페이지
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            aria-label="검색"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dddddd] bg-white"
          >
            <img className="h-5 w-5" src="/icons/search.svg" alt="" />
          </Link>

          {/* 로그인 상태에 따라 다른 버튼 표시 */}
          {accessToken ? (
            <>
              {/* 내 정보 조회에 성공하면 닉네임 표시 */}
              {member && (
                <span className="text-sm font-medium text-[#111111]">
                  {member.nickname}님
                </span>
              )}

              <button
                className="h-10 cursor-pointer rounded-md border-0 bg-blue-600 px-[18px] text-sm font-semibold text-white"
                type="button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex h-10 items-center rounded-md bg-blue-600 px-[18px] text-sm font-semibold text-white no-underline"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
