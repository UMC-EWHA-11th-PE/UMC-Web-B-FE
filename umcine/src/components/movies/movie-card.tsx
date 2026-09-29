import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-[#eeeeee]">
        <Link
        ///movies/어떤ID 형태의 페이지로 가서 현재 영화의 id를 넣을 것
          to="/movies/$movieId"
          params={{movieId: String(movie.id)}}
        >
          <img
            className="block h-full w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <button
        //북마크 안 되어 있으면 bookmark-button , 북마크 되어 있으면 bookmark-button bookmarked
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-[9px] border-2 p-0",
            movie.isBookmarked
              ? "border-blue-600 bg-blue-600"
              : "border-white bg-gray-900/90",
          )}
          type="button"
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={
            movie.isBookmarked ? "북마크 해제" : "북마크 추가"
          }
        >
          <img
            className="h-5 w-5 brightness-0 invert"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <h2 className="mt-3 mb-1.5 truncate text-left text-base font-semibold text-[#111111]">
        {movie.title}</h2>
      <p className="m-0 text-left text-sm text-[#888888]">
        {movie.releaseDate}</p>
    </article>
  );
}