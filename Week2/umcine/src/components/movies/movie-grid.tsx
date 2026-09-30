import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  bookmarkedIds: number[];
  onToggleBookmark: (movieId: number) => void;
}

export function MovieGrid({ movies, bookmarkedIds, onToggleBookmark }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5 min-[521px]:grid-cols-3 min-[801px]:grid-cols-5">
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

