import { Link, useLocation } from "react-router";

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="UMCine 홈">
          <img src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </Link>

        <nav className="main-nav" aria-label="주 메뉴">
          <Link className={pathname === "/" || pathname.startsWith("/movies/") ? "active" : ""} to="/">영화</Link>
          <Link className={pathname === "/search" ? "active" : ""} to="/search">검색</Link>
          <Link className={pathname === "/me" ? "active" : ""} to="/me">내 정보</Link>
        </nav>

        <div className="header-actions">
          <Link className="search-icon-button" to="/search" aria-label="영화 검색">
            <img src="/icons/search.svg" alt="" />
          </Link>
          <Link className="login-button" to="/login">로그인</Link>
        </div>
      </div>
    </header>
  );
}
