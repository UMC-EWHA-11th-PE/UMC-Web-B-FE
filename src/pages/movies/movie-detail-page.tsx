
import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { Movie } from "../../types/movie";

import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";

import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

import { useGetFavoritesQuery } from "../../hooks/use-get-favorites-query";
import { useToggleFavoriteMutation } from "../../hooks/use-toggle-favorite-mutation";
import { useCreateRatingMutation } from "../../hooks/use-create-rating-mutation";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });

  const movieId = Number(movieIdParam);
  const isValidMovieId =
    Number.isInteger(movieId) && movieId > 0;

  // 평점 입력 상태
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");

  // 즐겨찾기 목록 조회
  const {
    data: favorites = [],
    isLoading: isFavoritesLoading,
  } = useGetFavoritesQuery();

  // 즐겨찾기 등록 및 삭제
  const toggleFavoriteMutation = useToggleFavoriteMutation();

  // 평점 등록
  const createRatingMutation = useCreateRatingMutation();

  // 서버에서 받은 즐겨찾기 영화 ID
  const bookmarkedMovieIds = favorites.map(
    (favorite) => favorite.movieId,
  );

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  const detail = movieDetailQuery.data;

  const movie: Movie | null = detail
    ? {
        id: detail.id,
        title: detail.title,
        originalTitle: detail.original_title,
        releaseDate: detail.release_date ?? "",
        posterPath: detail.poster_path ?? "",
        backdropPath: detail.backdrop_path ?? "",
        genres: detail.genres.map((genre) => genre.name),
        runtime:
          detail.runtime == null ? "" : String(detail.runtime),
        tagline: detail.tagline ?? "",
        overview: detail.overview ?? "",
        isBookmarked: false,
      }
    : null;

  if (!isValidMovieId) {
    return (
      <main className="movie-detail-page">
        <div className="detail-container">
          <p>올바르지 않은 영화 번호예요.</p>
          <Link to="/">영화 목록으로 돌아가기</Link>
        </div>
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="movie-detail-page">
        <div className="detail-container">
          <p>영화 상세 정보를 불러오는 중이에요...</p>
        </div>
      </main>
    );
  }

  if (movieDetailQuery.isError || !movie) {
    return (
      <main className="movie-detail-page">
        <div className="detail-container">
          <p>
            {movieDetailQuery.isError
              ? getMovieDetailErrorMessage(movieDetailQuery.error)
              : "영화 정보를 찾을 수 없어요."}
          </p>
          <Link to="/">영화 목록으로 돌아가기</Link>
        </div>
      </main>
    );
  }

  const isBookmarked = bookmarkedMovieIds.includes(movie.id);
  const posterUrl = getTmdbPosterUrl(movie.posterPath);
  const backdropUrl = getTmdbBackdropUrl(movie.backdropPath);

  return (
    <main className="movie-detail-page">
      <section className="movie-hero">
        {backdropUrl && (
          <img
            className="movie-hero-image"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        )}

        <div className="movie-hero-overlay" />

        <div className="movie-hero-content">
          <Link to="/" className="back-link">
            ‹ 영화 목록
          </Link>

          <div className="hero-text">
            <h1>{movie.title}</h1>
            <p className="hero-meta">
              {movie.releaseDate || "개봉일 정보 없음"}
              {" · "}
              {movie.genres.join(" · ") || "장르 정보 없음"}
            </p>
          </div>
        </div>
      </section>

      <section className="movie-detail-content">
        <div className="movie-detail-main">
          {posterUrl ? (
            <img
              className="detail-poster"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="detail-poster">포스터 없음</div>
          )}

          <div className="movie-info">
            {movie.tagline && <h2>{movie.tagline}</h2>}

            <p className="movie-overview">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>

            <p>
              상영 시간:{" "}
              {movie.runtime
                ? `${movie.runtime}분`
                : "상영 시간 정보가 없어요."}
            </p>

            <button
              className="bookmark-detail-button"
              onClick={() =>
                toggleFavoriteMutation.mutate({
                  movieId: movie.id,
                  isBookmarked,
                })
              }
              disabled={
                isFavoritesLoading ||
                toggleFavoriteMutation.isPending
              }
            >
              {toggleFavoriteMutation.isPending
                ? "처리 중..."
                : isBookmarked
                  ? "북마크 해제"
                  : "+ 북마크"}
            </button>
          </div>
        </div>

        <aside className="rating-box">
          <h3>내 평점</h3>

          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setScore(star)}
              >
                {score >= star ? "★" : "☆"}
              </button>
            ))}
          </div>

          <p>선택한 점수: {score}점</p>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="영화 감상평을 입력해 주세요."
          />

          <button
            className="rating-save-button"
            disabled={
              score === 0 || createRatingMutation.isPending
            }
            onClick={() => {
              createRatingMutation.mutate({
                movieId: movie.id,
                score,
                comment,
              });
            }}
          >
            {createRatingMutation.isPending
              ? "저장 중..."
              : "평점 저장"}
          </button>

          {createRatingMutation.isSuccess && (
            <p>평점이 등록되었습니다!</p>
          )}

          {createRatingMutation.isError && (
            <p>평점 등록에 실패했습니다.</p>
          )}
        </aside>
      </section>

      <ReactQueryDevtools initialIsOpen={true} />
    </main>
  );
}
