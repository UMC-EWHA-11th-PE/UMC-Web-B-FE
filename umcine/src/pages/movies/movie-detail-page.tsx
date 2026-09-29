import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold">
          영화를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 배경 이미지 영역 */}
      <section className="relative h-[360px] overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* 배경을 살짝 어둡게 */}
        <div className="absolute inset-0 bg-black/25" />

        {/* 영화 목록으로 돌아가기 */}
        <div className="relative z-10 mx-auto max-w-6xl px-8 pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white"
          >
            <span aria-hidden="true">‹</span>
            영화 목록
          </Link>
        </div>

        {/* 영화 제목 */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-6xl px-8 pb-6 text-white">
            <h1 className="text-4xl font-bold">
              {movie.title}
            </h1>

            <p className="mt-2 text-sm">
              {movie.originalTitle}
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 영화 상세 정보 */}
      <section className="mx-auto grid max-w-6xl grid-cols-[180px_1fr_300px] gap-8 px-8 py-6">
        {/* 포스터 */}
        <div>
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-full rounded-lg object-cover shadow-md"
          />
        </div>

        {/* 영화 설명 */}
        <div>
          <h2 className="text-lg font-bold">
            {movie.tagline}
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-500">
            {movie.overview}
          </p>

          <button
            type="button"
            className="mt-5 rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
          >
            ♡ 즐겨찾기
          </button>
        </div>

        {/* 내 평점 */}
        <aside className="border-l border-gray-200 pl-8">
          <h2 className="text-lg font-bold">
            내 평점
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            별점은 필수, 후기는 선택이에요.
          </p>

          {/* 별점 */}
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                aria-label={`${score}점`}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-xl text-gray-500"
              >
                ★
              </button>
            ))}
          </div>

          {/* 감상평 */}
          <textarea
            className="mt-3 h-24 w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-sm outline-none"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
          />

          <button
            type="button"
            className="mt-2 w-full rounded-md bg-gray-900 py-3 text-sm font-semibold text-white"
          >
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  );
}