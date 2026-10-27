import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  // URL에서 가져온 영화 ID를 숫자로 변환
  const parsedMovieId = Number(movieId);

  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  // 영화 상세 데이터 및 요청 상태
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 영화 상세 API 요청
  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    // 유효하지 않은 영화 ID라면 요청하지 않음
    if (!isValidMovieId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) {
          setMovie(response);
        }
      })
      .catch((error: unknown) => {
        if (!ignore) {
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [parsedMovieId, isValidMovieId]);

  // 잘못된 영화 ID
  if (!isValidMovieId) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold">
          올바르지 않은 영화 번호예요.
        </p>
      </main>
    );
  }

  // 로딩 중
  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold">
          영화 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  // API 요청 오류
  if (errorMessage) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold">
          {errorMessage}
        </p>
      </main>
    );
  }

  // 영화 데이터가 없는 경우
  if (!movie) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold">
          영화를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  // TMDB 장르 배열을 문자열로 변환
  const genres = movie.genres
    .map((genre) => genre.name)
    .join(", ");

  // 상영 시간을 시간과 분으로 변환
  const runtime =
    movie.runtime !== null
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.";

  // TMDB 이미지 URL
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 배경 이미지 영역 */}
      <section className="relative h-[360px] overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

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
              {movie.original_title}
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <span>{movie.release_date.replaceAll("-", ".")}</span>
              <span>{genres}</span>
              <span>{runtime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 영화 상세 정보 */}
      <section className="mx-auto grid max-w-6xl grid-cols-[180px_1fr_300px] gap-8 px-8 py-6">
        {/* 포스터 */}
        <div>
          {posterUrl && (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="w-full rounded-lg object-cover shadow-md"
            />
          )}
        </div>

        {/* 영화 설명 */}
        <div>
          <h2 className="text-lg font-bold">
            {movie.tagline}
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-500">
            {movie.overview}
          </p>

          <BookmarkButton movieId={movie.id} />
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