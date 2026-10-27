
import type { Movie } from "../types/movie";
import { Link } from "@tanstack/react-router";
import { cn } from "../utils/cn";
import { getTmdbPosterUrl } from "../utils/movies/tmdb-image";

interface MovieCardProps {
  movie: Movie;
  onBookmarkToggle: (id: number) => void;
}

function MovieCard({ movie, onBookmarkToggle }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.posterPath);

  return (
    <div className="relative overflow-hidden">
      <div className="movie-poster">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {posterUrl ? (
            <img
              className="block w-full aspect-[2/3] object-cover rounded-[8px]"
              src={posterUrl}
              alt={movie.title}
            />
          ) : (
            <div className="flex w-full aspect-[2/3] items-center justify-center rounded-[8px] bg-gray-200 text-gray-500">
              포스터 없음
            </div>
          )}
        </Link>

        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 rounded-full p-2 text-white",
            movie.isBookmarked ? "bg-blue-600" : "bg-black/60",
          )}
          onClick={() => onBookmarkToggle(movie.id)}
          aria-label={
            movie.isBookmarked ? "북마크 해제" : "북마크 추가"
          }
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/movie-icons/bookmark.svg"
                : "/icons/movie-icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
      >
        <h3 className="mt-[8px] mb-[4px] text-[12px] font-[600] leading-[1.4] text-left text-[#111]">
          {movie.title}
        </h3>
      </Link>

      <p className="m-0 text-[11px] text-[#999] text-left">
        {movie.releaseDate}
      </p>
    </div>
  );
}

export default MovieCard;
