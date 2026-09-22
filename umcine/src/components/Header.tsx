function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <img src="/icons/movie-icons/movie.svg" alt="UMCine" />
          <span>UMCine</span>
        </div>

        <nav className="nav">
          <a href="#">영화</a>
          <a href="#">검색</a>
          <a href="#">내 정보</a>
        </nav>

        <div className="header-actions">
          <button className="search-button">
            <img
              src="/icons/movie-icons/search.svg"
              alt="검색"
            />
          </button>

          <button className="login-button">로그인</button>
        </div>
      </div>
    </header>
  );
}

export default Header;