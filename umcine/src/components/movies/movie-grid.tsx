// 기존 Movie 타입 대신 TMDB API에서 사용하는 영화 목록 타입 가져오기
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieCard from "./movie-card";

// 부모 컴포넌트(MovieListPage)에서 전달받을 영화 데이터 타입 정의
interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    // 전달받은 영화 배열을 그리드 형태로 표시
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {/* movies 배열을 순회하면서 영화마다 MovieCard 생성 */}
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}
