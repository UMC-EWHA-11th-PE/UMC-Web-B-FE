import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onBookmarkToggle: (id: number) => void;
}

function MovieGrid({ movies, onBookmarkToggle }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 
      gap-x-[16px] gap-y-[24px] 
      max-w-[840px] mx-auto 
      py-[24px] pb-[80px] 
      sm:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          onBookmarkToggle={onBookmarkToggle}
        />
      ))}
    </div>
  );
}

export default MovieGrid;