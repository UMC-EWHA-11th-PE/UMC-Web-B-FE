import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3 px-5 py-8 text-center text-xs text-slate-500">
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          aria-label="TMDB 웹사이트 (새 창)"
        >
          <Image
            src="/images/logos/tmdb-logo.svg"
            alt="TMDB"
            width={120}
            height={24}
            className="h-auto w-[120px]"
          />
        </a>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </div>
    </footer>
  );
}