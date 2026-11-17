import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-10 py-4">
      <div className="flex items-center gap-8">
        {/* 로고, 메뉴는 기존 그대로 */}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-9 w-9 rounded-lg border border-gray-300 bg-white"
          aria-label="검색"
        >
          🔍
        </button>

        {!accessToken ? (
          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <Link
            to="/me"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}
