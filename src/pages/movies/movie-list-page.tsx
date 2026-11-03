
import "../../App.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movie-grid";
import type { Movie } from "../../types/movie";
import { getMovies } from "../../api/movies/get-movies";
import { useBookmarkStore } from "../../utils/bookmark-storage";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies: Movie[] =
    moviesQuery.data?.results.map((movie) => ({
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
    })) ?? [];

  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

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

        {moviesQuery.isPending ? (
          <p>영화 목록을 불러오는 중이에요...</p>
        ) : moviesQuery.isError ? (
          <p>{moviesQuery.error.message}</p>
        ) : movies.length === 0 ? (
          <p>표시할 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid
              movies={movieList}
              onBookmarkToggle={toggleBookmark}
            />

          <div className="pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              ‹
            </button>

            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, index) => index + 1,
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                className={`pagination-number ${
                  page === pageNumber ? "active" : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              ›
            </button>
          </div>
          </>
        )}
      </main>

      <footer className="footer">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>

      <ReactQueryDevtools initialIsOpen={true} />
    </div>
  );
}
