import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-[#eeeeee]">
        <Link
          ///movies/어떤ID 형태의 페이지로 가서 현재 영화의 id를 넣을 것
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="block h-full w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        {/* 기존 북마크 버튼을 Zustand와 연결한 공통 버튼으로 교체 */}
        <BookmarkButton movieId={movie.id} className="absolute right-3 top-3" />
      </div>

      <h2 className="mt-3 mb-1.5 truncate text-left text-base font-semibold text-[#111111]">
        {movie.title}
      </h2>
      <p className="m-0 text-left text-sm text-[#888888]">
        {movie.releaseDate}
      </p>
    </article>
  );
}
