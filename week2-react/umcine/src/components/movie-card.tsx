import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card__poster-wrapper">
        <img
          className="movie-card__poster"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />
        <button
          type="button"
          className={
            movie.isBookmarked
              ? "movie-card__bookmark movie-card__bookmark--active"
              : "movie-card__bookmark"
          }
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
        />  
        </button>
      </div>
      <h3 className="movie-card__title">{movie.title}</h3>
      <p className="movie-card__release-date">{movie.releaseDate}</p>
    </article>
  );
}