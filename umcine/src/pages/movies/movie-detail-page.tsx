import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { toMovieFromDetail } from "../../api/movies/mappers";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  if (!isValidMovieId) {
    return (
      <main>
        <p role="alert">올바르지 않은 영화 번호예요.</p>
        <Link to="/">영화 목록</Link>
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return <main>영화 상세 정보를 불러오는 중이에요.</main>;
  }

  if (movieDetailQuery.isError) {
    return (
      <main>
        <p role="alert">{getMovieDetailErrorMessage(movieDetailQuery.error)}</p>
        <Link to="/">영화 목록</Link>
      </main>
    );
  }

  const isBookmarked = bookmarkedMovieIds.includes(movieDetailQuery.data.id);
  const movie = toMovieFromDetail(movieDetailQuery.data, isBookmarked);

  return (
    <main>
      <img src={movie.backdropPath} alt="" aria-hidden="true" />
      <Link to="/">영화 목록</Link>
      <img src={movie.posterPath} alt={`${movie.title} 포스터`} />

      <div className="flex items-center gap-3">
        <h1>{movie.title}</h1>
        <button
          type="button"
          className={cn(
            "rounded-full p-2 text-white",
            isBookmarked ? "bg-blue-600" : "bg-black/60",
          )}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => toggleBookmark(movie.id)}
        >
          <img
            src={
              isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <p>{movie.originalTitle}</p>
      <p>{movie.releaseDate}</p>
      <p>{movie.genres.join(" · ")}</p>
      <p>{movie.runtime}</p>
      <h2>{movie.tagline}</h2>
      <p>{movie.overview}</p>
    </main>
  );
}
