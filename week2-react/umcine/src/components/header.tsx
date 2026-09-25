export default function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <span className="header__logo">
          <img src="/icons/movie.svg" alt="UMCine" />
        </span>
        <span className="header__brand">UMCine</span>
        <nav className="header__nav">
          <a href="#" className="header__nav-item header__nav-item--active">
            영화
          </a>
          <a href="#" className="header__nav-item">
            검색
          </a>
          <a href="#" className="header__nav-item">
            내 정보
          </a>
        </nav>
      </div>
      <div className="header__right">
        <button type="button" className="header__search-button" aria-label="검색">
          🔍
        </button>
        <button type="button" className="header__login-button">
          로그인
        </button>
      </div>
    </header>
  );
}