import { useEffect, useState } from 'react';
import { MovieGrid } from '../../components/movies/movie-grid';
import { Pagination } from '../../components/movies/pagination';
import { getMovies } from '../../api/movies/get-movies';
import type { TmdbMovieListItem } from '../../api/movies/models';

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0); // 다시시도를 위한 재요청 상태

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });

        if (!ignore) {
          setMovies(response.results);
          setTotalPages(response.total_pages);
        }
      } catch {
        if (!ignore) {
          setErrorMessage('영화 목록을 불러오지 못했어요.');
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
  }, [currentPage, retryCount]);

  return (
    <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 pb-20 pt-[26px] sm:px-5">
      <h1 className="mb-[18px] text-3xl font-extrabold">영화 목록</h1>

      {isLoading ? (
        <p role="status">영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p role="alert" className="text-red-600">
          {errorMessage}
          <button type ="button" 
           onClick={()=> setRetryCount((count)=> count+1)}
            className="mt-3 rounded bg-blue-600 px-4 py-2 text-sm text-white">
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
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </main>
  );
}