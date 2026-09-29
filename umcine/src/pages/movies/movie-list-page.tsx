import { useState } from "react";

import MovieGrid from "../../components/movies/movie-grid";
import { movies as initialMovies } from "../../data/movies";
import Footer from "../../components/layout/footer";

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-8 py-8">
        <h1 className="mb-6 text-3xl font-bold">
          영화 목록
        </h1>

        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />
      </main>

      <Footer />
    </>
  );
}