import "./App.css"
import { useState } from "react";

import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import { movies as initialMovies } from "./data/movies";
import Footer from "./components/footer";

export default function App() {
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
      <Header />

      <main className="movie-page">
        <h1 className="page-title">영화 목록</h1>

        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />
      </main>

      <Footer />
    </>
  );
}