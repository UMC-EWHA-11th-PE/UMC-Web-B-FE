import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { readToken } from '@/api/session';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { cn } from '../../utils/cn';
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";


export function Header() {
  const { pathname } = useLocation();
  const token = useAuthStore(state => state.accessToken);
  const loggedIn = !!readToken(token);
  const navigate = useNavigate();
  const client = useQueryClient();
  
  //내 정보 query
  const accessToken=useAuthStore((state)=>state.accessToken);
  const meQuery=useQuery({
    queryKey:["members","me"],
    queryFn:getMe,
    enabled:Boolean(accessToken),
    staleTime:5*60*1000,
    retry:false
  });

  function logout() {
    useAuthStore.getState().clearAuth();
    useProfileStore.getState().clearProfile();
    client.removeQueries({ queryKey: ['ratings'] });
    void navigate({ to: '/login' });
  }
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
        <Link
          to="/mypage"
          aria-current={pathname.startsWith("/mypage") ? "page" : undefined}
          className={cn(
            "text-gray-500 transition-colors hover:text-blue-600",
            pathname.startsWith("/mypage") &&
              "font-bold text-gray-900 underline underline-offset-4",
          )}
        >
          내 정보
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-3 text-xs font-bold">
        {!accessToken ? (
          <Link to="/login">로그인</Link>
        ) : meQuery.isLoading ? (
          <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <Link to="/mypage">마이페이지</Link>
        )}
      </div>
      <Link to="/search" aria-label="영화 검색" className="ml-3 grid size-[42px] place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"><img src="/icons/search.svg" alt="" className="size-5" /></Link>
    </div>
  </header>;
}

