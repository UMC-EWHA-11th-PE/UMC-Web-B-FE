import { useState } from "react";
import { MovieGrid } from "../components/movie-grid";
import { Pagination } from "../components/pagination";
import type { Movie } from "../types/movie";

const PAGE_SIZE = 10;

interface MovieListPageProps {
  movies: Movie[];
  bookmarkedIds: number[];
  onToggleBookmark: (movieId: number) => void;
}

export function MovieListPage({ movies, bookmarkedIds, onToggleBookmark }: MovieListPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(movies.length / PAGE_SIZE);
  const visibleMovies = movies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main className="movie-list-page">
      <div className="movie-list-inner">
        <h1>영화 목록</h1>
        <MovieGrid
          movies={visibleMovies}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={onToggleBookmark}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}
