import type { Movie } from "../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  bookmarkedIds: number[];
  onToggleBookmark: (movieId: number) => void;
}

export function MovieGrid({ movies, bookmarkedIds, onToggleBookmark }: MovieGridProps) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isBookmarked={bookmarkedIds.includes(movie.id)}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </div>
  );
}
