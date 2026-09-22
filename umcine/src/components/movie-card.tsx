import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onBookmarkToggle: (id: number) => void;
}

function MovieCard({ movie, onBookmarkToggle }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={movie.posterPath} alt={movie.title} />

        <button
          className="bookmark-button"
          onClick={() => onBookmarkToggle(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/movie-icons/bookmark.svg"
                : "/icons/movie-icons/bookmark-outline.svg"
            }
            alt="북마크"
          />
        </button>
      </div>

      <h3>{movie.title}</h3>
      <p>{movie.releaseDate}</p>
    </div>
  );
}

export default MovieCard;