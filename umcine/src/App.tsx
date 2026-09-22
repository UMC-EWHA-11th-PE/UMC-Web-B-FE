import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import MovieGrid from "./components/movie-grid";
import { movies } from "./data/movies";

function App() {
  const [movieList, setMovieList] = useState(movies);

  const handleBookmarkToggle = (id: number) => {
    setMovieList((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  };

  return (
    <div>
      <Header />

      <main>
        <div className="page-title">
          <h2>영화 목록</h2>
        </div>

        <MovieGrid
          movies={movieList}
          onBookmarkToggle={handleBookmarkToggle}
        />
      </main>

      <footer className="footer">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
}

export default App;