export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
        {/* TMDB 공식 로고를 클릭하면 TMDB 홈페이지로 이동 */}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/images/tmdb-logo.png" alt="TMDB" className="h-6 w-auto" />
        </a>

        {/* TMDB API 사용 시 필수 출처 표기 문구 */}
        <p className="text-xs text-gray-500">
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </div>
    </footer>
  );
}
