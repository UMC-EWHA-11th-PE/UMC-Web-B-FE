import { useState } from 'react';
import { MovieGrid } from '../../components/movies/movie-grid';
import { Pagination } from '../../components/movies/pagination';
import { movies } from '../../data/movie';

const PAGE_SIZE = 10;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  
  return <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 pb-20 pt-[26px] sm:px-5">
    <h1 className="mb-[18px] text-3xl font-extrabold">영화 목록</h1>
    <MovieGrid movies={movies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)}  />
    <Pagination currentPage={currentPage} totalPages={Math.ceil(movies.length / PAGE_SIZE)} onPageChange={setCurrentPage} />
  </main>;
}

