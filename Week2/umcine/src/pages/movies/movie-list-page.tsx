import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MovieGrid } from '../../components/movies/movie-grid';
import { Pagination } from '../../components/movies/pagination';
import { getMovies } from '../../api/movies/get-movies';

export function MovieListPage() {
  const [page, setPage]= useState(1);
  const moviesQuery= useQuery({
    queryKey: ["movies", "list", {page}],
    queryFn: () => getMovies({page})});

  const movies= moviesQuery.data?.results ?? [];
  const totalPages= moviesQuery.data?.total_pages ?? 0;
  
  const handlePageChange= (newPage: number) => {
    setPage(newPage);
  };

  return (
    <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 pb-20 pt-[26px] sm:px-5">
      <h1 className="mb-[18px] text-3xl font-extrabold">영화 목록</h1>

      {moviesQuery.isPending ? (
        <p role="status">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p role="alert" className="text-red-600">
          영화 목록을 불러오지 못했어요.
          <button
            type="button"
            onClick={() => void moviesQuery.refetch()}
            className="mt-3 rounded bg-blue-600 px-4 py-2 text-sm text-white"
          >
            다시 시도
          </button>
        </p>
      ) : movies.length === 0 ? (
        <p role="status">표시할 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </main>
  );
}