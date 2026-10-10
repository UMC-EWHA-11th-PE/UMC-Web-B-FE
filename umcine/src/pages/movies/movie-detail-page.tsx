import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  // URL의 movieId와 같은 영화 찾기s
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <p className="text-lg font-semibold">영화를 찾을 수 없어요.</p>
      </main>
    );
  }

  return (
    <main className="bg-gray-50">
      {/* 영화 배경 영역 */}
      <section className="relative h-[360px] overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />

        {/* 글자가 잘 보이도록 어두운 배경 */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between px-6 py-8 text-white">
          <Link to="/" className="w-fit text-sm font-medium text-white">
            ← 영화 목록
          </Link>

          <div>
            <h1 className="text-4xl font-bold">{movie.title}</h1>

            <p className="mt-3 text-sm text-gray-200">{movie.originalTitle}</p>

            <p className="mt-2 text-sm text-gray-200">
              {movie.releaseDate}
              {" · "}
              {movie.genres.join(" · ")}
              {" · "}
              {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      {/* 영화 상세 정보 */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <img
            className="w-48 shrink-0 self-start rounded-lg object-cover shadow-lg"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {movie.tagline}
            </h2>

            <p className="mt-5 leading-7 text-gray-600">{movie.overview}</p>

            {/* 기존 즐겨찾기 버튼 위치에 Zustand 북마크 버튼 연결 */}
            <div className="mt-6">
              <BookmarkButton movieId={movie.id} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
