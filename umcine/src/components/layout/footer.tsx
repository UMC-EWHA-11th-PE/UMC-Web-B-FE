export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1200px] flex-col items-center gap-3 px-10 py-8 text-center text-xs text-gray-500">
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noreferrer"
        aria-label="TMDB 웹사이트 (새 창)"
      >
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB 로고"
          className="h-4"
        />
      </a>
      <p>
        이 제품은 TMDB API를 사용하지만 TMDB의 보증이나 인증을 받은 것은
        아닙니다.
      </p>
    </footer>
  );
}
