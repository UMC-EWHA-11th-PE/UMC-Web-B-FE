
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { Movie } from "../../types/movie";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import { useBookmarkStore } from "../../utils/bookmark-storage";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });

  const movieId = Number(movieIdParam);
  const isValidMovieId =
    Number.isInteger(movieId) && movieId > 0;

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
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
              onClick={() => toggleBookmark(movie.id)}
            >
              {isBookmarked ? "북마크 해제" : "+ 북마크"}
            </button>
          </div>
        </div>

        <aside className="rating-box">
          <h3>내 평점</h3>
          <div className="rating-stars">
            <button>☆</button>
            <button>☆</button>
            <button>☆</button>
            <button>☆</button>
            <button>☆</button>
          </div>
          <button className="rating-save-button">평점 저장</button>
        </aside>
      </section>
      
      <ReactQueryDevtools initialIsOpen={true} />
    </main>
  );
}
