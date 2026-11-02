import { useEffect, useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

// TMDB API에서 인기 영화 목록을 가져오는 함수
import { getMovies } from "../../api/movies/get-movies";

// TMDB API가 반환하는 영화 목록 데이터의 타입
import type { TmdbMovieListItem } from "../../api/movies/models";

export function MovieListPage() {
  // 기존에는 직접 작성한 movies 배열을 사용했지만,
  // 이제는 TMDB API에서 받아온 영화 목록을 state로 관리함
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);

  // API 요청이 진행 중인지 확인하는 상태
  const [isLoading, setIsLoading] = useState(true);

  // API 요청에 실패했을 때 오류 메시지를 저장하는 상태
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 컴포넌트가 처음 화면에 나타날 때 영화 목록을 요청함
  useEffect(() => {
    // 컴포넌트가 사라진 뒤 이전 요청 결과가 state를 변경하지 않도록 방지
    let ignore = false;

    // TMDB API에서 인기 영화 목록을 가져오는 비동기 함수
    async function loadMovies() {
      // 요청을 시작하므로 로딩 상태를 true로 변경
      setIsLoading(true);

      // 이전에 발생했던 오류 메시지 초기화
      setErrorMessage(null);

      try {
        // TMDB API에서 인기 영화 1페이지 요청
        const response = await getMovies({ page: 1 });

        // 컴포넌트가 여전히 유효하다면 영화 목록 저장
        // response.results에는 영화 객체들이 배열로 들어 있음
        if (!ignore) {
          setMovies(response.results);
        }
      } catch {
        // API 요청에 실패하면 오류 메시지 저장
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        // 요청 성공 여부와 관계없이 로딩 종료
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    // 위에서 정의한 비동기 함수 실행
    loadMovies();

    // 컴포넌트가 사라지거나 Effect가 정리될 때 실행
    return () => {
      ignore = true;
    };
  }, []); // 빈 배열이므로 마운트 시 실행 (개발 모드에서는 추가 실행될 수 있음)

  return (
    <main className="mx-auto max-w-[1200px] px-6 pt-12 pb-20">
      <h1 className="mb-8 text-[28px] font-bold text-[#111111]">영화 목록</h1>

      {/* API 요청 상태에 따라 다른 화면을 표시함 */}
      {isLoading ? (
        // 1. 영화 데이터를 불러오는 중
        <p>영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        // 2. API 요청에 실패한 경우
        <p>{errorMessage}</p>
      ) : movies.length === 0 ? (
        // 3. 요청은 성공했지만 영화가 없는 경우
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        // 4. 요청에 성공하면 영화 목록과 페이지네이션 표시
        <>
          {/* TMDB에서 받아온 영화 데이터를 MovieGrid에 전달 */}
          <MovieGrid movies={movies} />

          <Pagination />
        </>
      )}
    </main>
  );
}
