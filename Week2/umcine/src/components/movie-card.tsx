import { Link } from "react-router";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  isBookmarked: boolean;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, isBookmarked, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrap">
        <Link className="poster-link" to={`/movies/${movie.id}`}>
          <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>
        <button
          className={`bookmark-button${isBookmarked ? " bookmarked" : ""}`}
          type="button"
          aria-label={`${movie.title} 즐겨찾기 ${isBookmarked ? "해제" : "추가"}`}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
          />
        </button>
      </div>
      <h2><Link to={`/movies/${movie.id}`}>{movie.title}</Link></h2>
      <p>{movie.releaseDate}</p>
    </article>
  );
}
