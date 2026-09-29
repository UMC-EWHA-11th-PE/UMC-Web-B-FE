import { Link } from "@tanstack/react-router";

export function Header() {
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

          <a
            href="#"
            className="text-sm font-medium text-gray-500 no-underline"
          >
            내 정보
          </a>
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

        <button className="h-10 cursor-pointer rounded-md border-0 bg-[#4f63e9] px-[18px] text-sm font-semibold text-white">
          로그인
        </button>
      </div>
    </header>
  );
}