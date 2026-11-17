export default function Footer() {
  return (
    <footer className="flex min-h-[72px] items-center justify-end border-t border-gray-200 bg-white px-16">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="h-auto w-7"
        />

        <span>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <span className="underline">TMDB</span>.
        </span>
      </div>
    </footer>
  );
}