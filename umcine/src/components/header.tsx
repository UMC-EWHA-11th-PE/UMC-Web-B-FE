import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <a href="#" className="logo">
            <div className="logo-icon">
                <img
                    src="/icons/movie-icons/movie.svg"
                    alt=""
                />
            </div>

            <span>UMCine</span>
        </a>

        <nav className="nav">
          <a href="#">영화</a>
          <a href="#">검색</a>
          <a href="#">내 정보</a>
        </nav>
      </div>

      <div className="header-right">
        <button className="search-button" aria-label="검색">
          <img src="/icons/movie-icons/search.svg" alt="검색" />
        </button>

        <button className="login-button">
          로그인
        </button>
      </div>
    </header>
  );
}