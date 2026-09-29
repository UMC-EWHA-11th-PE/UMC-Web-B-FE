import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          className="movie-poster"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <button
        //북마크 안 되어 있으면 bookmark-button , 북마크 되어 있으면 bookmark-button bookmarked
          className={`bookmark-button ${
                movie.isBookmarked ? "bookmarked" : ""
          }`}
          type="button"
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={
            movie.isBookmarked ? "북마크 해제" : "북마크 추가"
          }
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <h2 className="movie-title">{movie.title}</h2>
      <p className="movie-date">{movie.releaseDate}</p>
    </article>
  );
}