import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="relative">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="block text-inherit no-underline"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-300">
          <img
            className="h-full w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </div>
        <h3 className="mt-2.5 mb-1 truncate text-sm">{movie.title}</h3>
      </Link>
      <button
        type="button"
        className={cn(
          "absolute right-2 top-2 rounded-full p-2 text-white",
          movie.isBookmarked ? "bg-blue-600" : "bg-black/60",
        )}
        aria-pressed={movie.isBookmarked}
        aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
        onClick={() => onToggleBookmark(movie.id)}
      >
        <img
          src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
          alt=""
        />
      </button>
      <p className="m-0 text-xs text-gray-500">{movie.releaseDate}</p>
    </article>
  );
}