import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  //클릭한 영화의 ID를 찾아서 같으면 영화 정보 가져오기 북마크 값 뒤집기
  //기존에는 handleToggleBookmark에서 setMovies로 변경했지만
  //이제는 Zustand의 toggleBookmark 함수가 담당함

  return (
    <main className="mx-auto max-w-[1200px] px-6 pt-12 pb-20">
      <h1 className="mb-8 text-[28px] font-bold text-[#111111]">영화 목록</h1>

      <MovieGrid movies={movies} />

      <Pagination />
    </main>
  );
}
