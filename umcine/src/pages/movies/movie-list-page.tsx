import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import { toMovie } from "../../api/movies/mappers";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";
import "./movie-list-page.css";

export function MovieListPage() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const [tmdbMovies, setTmdbMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });
        if (!ignore) {
          setTmdbMovies(response.results);
          setTotalPages(response.total_pages);
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();
    return () => {
      ignore = true;
    };
  }, [currentPage]);

  const movies = tmdbMovies.map((movie) =>
    toMovie(movie, bookmarkedMovieIds.includes(movie.id)),
  );

  return (
    <main className="movie-page">
      <h1 className="movie-page__title">영화 목록</h1>

      {isLoading && <p>불러오는 중...</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {!isLoading && !errorMessage && movies.length === 0 && (
        <p>표시할 영화가 없어요.</p>
      )}
      {!isLoading && !errorMessage && movies.length > 0 && (
        <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={Math.min(totalPages, 500)}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
