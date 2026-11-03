import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import { toMovie } from "../../api/movies/mappers";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";
import "./movie-list-page.css";

export function MovieListPage() {
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = (moviesQuery.data?.results ?? []).map((movie) =>
    toMovie(movie, bookmarkedMovieIds.includes(movie.id)),
  );
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  return (
    <main className="movie-page">
      <h1 className="movie-page__title">영화 목록</h1>

      {moviesQuery.isPending && <p>불러오는 중...</p>}
      {moviesQuery.isError && (
        <p role="alert">영화 목록을 불러오지 못했어요.</p>
      )}
      {moviesQuery.isSuccess && movies.length === 0 && (
        <p>표시할 영화가 없어요.</p>
      )}
      {moviesQuery.isSuccess && movies.length > 0 && (
        <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
      )}

      <Pagination
        currentPage={page}
        totalPages={Math.min(totalPages, 500)}
        onPageChange={setPage}
      />
    </main>
  );
}
