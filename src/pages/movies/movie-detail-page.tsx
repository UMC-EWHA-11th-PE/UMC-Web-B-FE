import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../utils/bookmark-storage";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark
  );

  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="movie-detail-page">
        <div className="detail-container">
          <p>영화를 찾을 수 없어요.</p>
        </div>
      </main>
    );
  }

  const isBookmarked = bookmarkedMovieIds.includes(movie.id);

  return (
    <main className="movie-detail-page">
      <section className="movie-hero">
        <img
          className="movie-hero-image"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />

        <div className="movie-hero-overlay" />

        <div className="movie-hero-content">
          <Link to="/" className="back-link">
            ‹ 영화 목록
          </Link>

          <div className="hero-text">
            <h1>{movie.title}</h1>

            <p className="hero-meta">
              {movie.releaseDate} · {movie.genres.join(" · ")}
            </p>
          </div>
        </div>
      </section>

      <section className="movie-detail-content">
        <div className="movie-detail-main">
          <img
            className="detail-poster"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />

          <div className="movie-info">
            <h2>{movie.tagline}</h2>

            <p className="movie-overview">
              {movie.overview}
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

          <button className="rating-save-button">
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  );
}