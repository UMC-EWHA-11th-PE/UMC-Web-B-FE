import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { toMovieFromDetail } from "../../api/movies/mappers";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const id = Number(movieId);
  const isValidId = Number.isInteger(id) && id > 0;

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const [detail, setDetail] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isValidId) return; // 잘못된 주소면 요청하지 않음

    let ignore = false;

    async function loadDetail() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovieDetail(id);
        if (!ignore) setDetail(response);
      } catch (error) {
        if (ignore) return;
        setDetail(null);
        const status = (error as { response?: { status?: number } }).response
          ?.status;
        setErrorMessage(
          status === 404
            ? "영화를 찾을 수 없어요."
            : "영화 정보를 불러오지 못했어요.",
        );
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadDetail();
    return () => {
      ignore = true;
    };
  }, [id, isValidId]);

  if (!isValidId) {
    return (
      <main>
        <p role="alert">잘못된 영화 주소예요.</p>
        <Link to="/">영화 목록</Link>
      </main>
    );
  }

  if (isLoading) {
    return <main>불러오는 중...</main>;
  }

  if (errorMessage || !detail) {
    return (
      <main>
        <p role="alert">{errorMessage ?? "영화를 찾을 수 없어요."}</p>
        <Link to="/">영화 목록</Link>
      </main>
    );
  }

  const isBookmarked = bookmarkedMovieIds.includes(detail.id);
  const movie = toMovieFromDetail(detail, isBookmarked);

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
