import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '../../utils/cn';

export function Header() {
  const { pathname } = useLocation();
  const isMovieActive=pathname==="/"||pathname.startsWith("/movies/");
  const isSearchActive=pathname==="/search";
  
  return <header className="h-[72px] shrink-0 border-b border-gray-200 bg-white">
    <div className="mx-auto flex h-full max-w-[1320px] items-center px-4 sm:px-5">
      <Link to="/" aria-label="UMCine 홈" className="flex items-center gap-2 text-xl font-extrabold"><img src="/icons/movie.svg" alt="" className="size-[30px]" /><span>UMCine</span></Link>
      <nav aria-label="주 메뉴" className="ml-6 flex gap-5 text-sm font-semibold sm:ml-[42px] sm:gap-7">
            <Link
          to="/"
          aria-current={isMovieActive ? "page" : undefined}
          className={cn(
            "text-gray-500 transition-colors hover:text-blue-600",
            isMovieActive &&
              "font-bold text-gray-900 underline underline-offset-4",
          )}
        >
          영화
        </Link>

        <Link
          to="/search"
          aria-current={isSearchActive ? "page" : undefined}
          className={cn(
            "text-gray-500 transition-colors hover:text-blue-600",
            isSearchActive &&
              "font-bold text-gray-900 underline underline-offset-4",
          )}
        >
          검색
        </Link>  
      </nav>
      <Link to="/search" aria-label="영화 검색" className="ml-auto grid size-[42px] place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"><img src="/icons/search.svg" alt="" className="size-5" /></Link>
    </div>
  </header>;
}

