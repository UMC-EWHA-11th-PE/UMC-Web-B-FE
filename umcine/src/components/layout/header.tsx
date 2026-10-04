//<a>는 일반적인 웹 링크이고, 
//Link는 TanStack Router에게 페이지 이동을 맡기는 컴포넌트
//즉 React 앱 자체를 유지하면서: / -> /search 처럼 화면 바꾸는거 가능

import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="h-[72px] w-full border-b border-[#eeeeee] bg-white">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-12">
          <Link
            className="flex items-center gap-2 text-xl font-bold text-[#111111] no-underline"
            to="/"
          >
            <img
              className="h-7 w-7"
              src="/icons/movie.svg"
              alt=""
            />
            <span>UMCine</span>
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              className="text-sm font-semibold text-[#111111] underline underline-offset-8"
              to="/"
            >
              영화
            </Link>

            <Link
              className="text-sm text-[#666666] no-underline"
              to="/search"
            >
              검색
            </Link>

            <Link
              className="text-sm text-[#666666] no-underline"
              to="/"
            >
              내 정보
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            aria-label="검색"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dddddd] bg-white"
          >
            <img
              className="h-5 w-5"
              src="/icons/search.svg"
              alt=""
            />
          </Link>

          <button
            className="h-10 cursor-pointer rounded-md border-0 bg-blue-600 px-[18px] text-sm font-semibold text-white"
            type="button"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}