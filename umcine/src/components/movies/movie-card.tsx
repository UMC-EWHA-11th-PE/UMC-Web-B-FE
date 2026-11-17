import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
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

        <BookmarkButton movieId={movie.id} />
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