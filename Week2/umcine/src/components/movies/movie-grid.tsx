import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies}: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5 min-[521px]:grid-cols-3 min-[801px]:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </div>
  );
}

