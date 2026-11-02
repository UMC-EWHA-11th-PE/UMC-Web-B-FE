import { Link } from "@tanstack/react-router";

// 기존 Movie 타입 대신 TMDB 영화 목록 타입 사용
import type { TmdbMovieListItem } from "../../api/movies/models";

// TMDB의 poster_path를 실제 이미지 URL로 변환하는 함수
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

import { BookmarkButton } from "../bookmark-button";

// 부모 컴포넌트(MovieGrid)에서 전달받는 영화 데이터 타입
interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  // TMDB는 이미지 전체 URL이 아니라 poster_path만 반환하므로
  // 실제 이미지 주소로 변환해야 함
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="min-w-0">
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-[#eeeeee]">
        <Link
          // 영화를 클릭하면 해당 영화 ID의 상세 페이지로 이동
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full w-full"
        >
          {/* 포스터가 있으면 이미지를 표시하고, 없으면 안내 문구 표시 */}
          {posterUrl ? (
            <img
              className="block h-full w-full object-cover"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#888888]">
              이미지 없음
            </div>
          )}
        </Link>

        {/* 기존 Zustand 북마크 기능 유지 */}
        <BookmarkButton movieId={movie.id} className="absolute right-3 top-3" />
      </div>

      {/* TMDB API에서 받아온 영화 제목 */}
      <h2 className="mt-3 mb-1.5 truncate text-left text-base font-semibold text-[#111111]">
        {movie.title}
      </h2>

      {/* 기존 releaseDate 대신 TMDB의 release_date 사용 */}
      <p className="m-0 text-left text-sm text-[#888888]">
        {movie.release_date}
      </p>
    </article>
  );
}
