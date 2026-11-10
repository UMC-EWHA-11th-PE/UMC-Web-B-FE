import { useAuthStore } from '@/stores/auth-store';
import { useProfileStore } from '@/stores/profile-store';
import { readToken } from '@/api/session';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { cn } from '../../utils/cn';

export function Header() {
  const { pathname } = useLocation();
  const token = useAuthStore(state => state.accessToken);
  const loggedIn = !!readToken(token);
  const navigate = useNavigate();
  const client = useQueryClient();
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
        {loggedIn ? <button type="button" onClick={logout}>로그아웃</button> : <><Link to="/login">로그인</Link><Link to="/signup">회원가입</Link></>}
      </div>
      <Link to="/search" aria-label="영화 검색" className="ml-3 grid size-[42px] place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"><img src="/icons/search.svg" alt="" className="size-5" /></Link>
    </div>
  </header>;
}

