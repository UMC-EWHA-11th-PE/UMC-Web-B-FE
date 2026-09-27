import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-10 py-4">
      <div className="flex items-center gap-8">
        <span className="text-xl">
          <img src="/icons/movie.svg" alt="UMCine" />
        </span>
        <span className="text-lg font-bold">UMCine</span>
        <nav className="flex gap-5">
          <Link
            to="/"
            className="text-sm text-gray-600"
            activeProps={{ className: "text-sm font-bold text-gray-900" }}
            activeOptions={{ exact: true }}
          >
            영화
          </Link>
          <Link
            to="/search"
            className="text-sm text-gray-600"
            activeProps={{ className: "text-sm font-bold text-gray-900" }}
          >
            검색
          </Link>
          <a href="#" className="text-sm text-gray-600">
            내 정보
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-9 w-9 rounded-lg border border-gray-300 bg-white"
          aria-label="검색"
        >
          🔍
        </button>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}