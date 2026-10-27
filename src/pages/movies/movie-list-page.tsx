
import "../../App.css";
import { useEffect, useState } from "react";
import MovieGrid from "../../components/movie-grid";
import type { Movie } from "../../types/movie";
import { getMovies } from "../../api/movies/get-movies";
import { useBookmarkStore } from "../../utils/bookmark-storage";

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });

        const mappedMovies: Movie[] = response.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          originalTitle: movie.original_title,
          releaseDate: movie.release_date,
          posterPath: movie.poster_path ?? "",
          backdropPath: movie.backdrop_path ?? "",
          genres: [],
          runtime: "",
          tagline: "",
          overview: movie.overview,
          isBookmarked: false,
        }));

        if (!ignore) {
          setMovies(mappedMovies);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  const movieList = movies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  return (
    <div>
      <main>
        <div className="page-title">
          <h2>영화 목록</h2>
        </div>

        {isLoading ? (
          <p>영화 목록을 불러오는 중이에요...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : (
          <MovieGrid
            movies={movieList}
            onBookmarkToggle={toggleBookmark}
          />
        )}
      </main>

      <footer className="footer">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
}
