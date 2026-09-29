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
      <div className="relative w-full">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="block w-full aspect-[2.7/3] object-cover rounded-lg"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <button
          className={cn(
            "absolute top-[10px] right-[10px] flex h-8 w-8 items-center justify-center rounded-[7px] border-0 p-0 cursor-pointer",
            movie.isBookmarked ? "bg-[#4f6bed]" : "bg-black/75",
          )}
          onClick={() => onToggleBookmark(movie.id)}
          aria-label="북마크"
        >
          <img
            className="h-5 w-5 brightness-0 invert"
            src={
              movie.isBookmarked
                ? "/icons/movie-icons/bookmark.svg"
                : "/icons/movie-icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <h2 className="mt-2 mb-[2px] text-sm font-semibold">
        {movie.title}
      </h2>

      <p className="m-0 text-[13px] text-gray-500">
        {movie.releaseDate}
      </p>
    </article>
  );
}