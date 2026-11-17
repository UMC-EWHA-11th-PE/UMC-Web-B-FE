
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  // 저장된 로그인 토큰 가져오기
  const accessToken = useAuthStore((state) => state.accessToken);

  // 로그인한 사용자 정보 조회
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-16">
      <div className="flex items-center gap-12">
        {/* 로고 */}
        <Link
          to="/"
          className="flex items-center gap-[10px] text-[22px] font-bold text-[#17171c] no-underline"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border-2 border-[#17171c]">
            <img
              className="h-[26px] w-[26px]"
              src="/icons/movie-icons/movie.svg"
              alt=""
            />
          </div>

          <span>UMCine</span>
        </Link>

        {/* 메뉴 */}
        <nav className="flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-900 no-underline"
          >
            영화
          </Link>

          <Link
            to="/search"
            className="text-sm font-medium text-gray-500 no-underline"
          >
            검색
          </Link>

          <Link
            to="/mypage"
            className="text-sm font-medium text-gray-500 no-underline"
          >
            내 정보
          </Link>
        </nav>
      </div>

      {/* 오른쪽 영역 */}
      <div className="flex items-center gap-3">
        <button
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white p-0"
          aria-label="검색"
        >
          <img
            className="h-[22px] w-[22px]"
            src="/icons/movie-icons/search.svg"
            alt="검색"
          />
        </button>

        {/* 로그인 상태에 따른 버튼 표시 */}
        {!accessToken ? (
          <Link
            to="/login"
            className="flex h-10 items-center justify-center rounded-md bg-[#4f63e9] px-[18px] text-sm font-semibold text-white no-underline"
          >
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <Link
            to="/mypage"
            className="flex h-10 items-center justify-center rounded-md bg-[#4f63e9] px-[18px] text-sm font-semibold text-white no-underline"
          >
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}
