import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

// TMDB API에서 인기 영화 목록을 가져오는 함수
import { getMovies } from "../../api/movies/get-movies";

export function MovieListPage() {
  //현재 보고 있는 영화 목록의 페이지 번호
  const [page, setPage] = useState(1);

  //tanstack Query고 영화 목록 요청 및 상태 관리
  const moviesQuery = useQuery({
    //페이지 번호별로 영화 목록을 구분하여 캐시에 저장
    queryKey: ["movies", "list", { page }],

    //TMDB API에서 해당 페이지의 영화 목록 가져오기
    queryFn: () => getMovies({ page }),
  });

  //API 응답에서 영화 목록과 전체 페이지 수 추출
  // 아직 데이터가 없다면 빈 배열과 0을 사용
  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  //페이지 번호가 변경되면 새로운 영화 목록 요청
  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="mx-auto max-w-[1200px] px-6 pt-12 pb-20">
      <h1 className="mb-8 text-[28px] font-bold text-[#111111]">영화 목록</h1>

      {/* API 요청 상태에 따라 다른 화면을 표시함 */}
      {moviesQuery.isPending ? (
        // 1. 영화 데이터를 불러오는 중
        <p>영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        // 2. API 요청에 실패한 경우
        <p>영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        // 3. 요청은 성공했지만 영화가 없는 경우
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        // 4. 요청에 성공하면 영화 목록과 페이지네이션 표시
        <>
          {/* TMDB에서 받아온 영화 데이터를 MovieGrid에 전달 */}
          <MovieGrid movies={movies} />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}
