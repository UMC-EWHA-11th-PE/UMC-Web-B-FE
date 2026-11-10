import { Link, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { RatingEditor } from '@/components/movies/rating-editor';
import { cn } from '../../utils/cn';
import { getMovieDetail } from '../../api/movies/get-movie-detail';
import { getMovieDetailErrorMessage } from '../../utils/movies/get-movie-detail-error-message';
import { useBookmarkStore } from '../../stores/bookmark-store';
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from '../../utils/movies/tmdb-image';

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({
    from: '/movies/$movieId',
  });

  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ['movies', 'detail', movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  const movie = movieDetailQuery.data;

  const isBookmarked = useBookmarkStore(state =>
    movie ? state.bookmarkedMovieIds.includes(movie.id) : false,
  );
  const toggleBookmark = useBookmarkStore(state => state.toggleBookmark);

  if (!isValidMovieId) {
    return (
      <main className="mx-auto w-full max-w-[1320px] flex-1 px-5 py-20">
        <h1 role="alert" className="mb-4 text-2xl font-bold">
          올바르지 않은 영화 번호예요.
        </h1>

        <Link to="/" className="text-blue-600 underline">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-[1320px] flex-1 px-5 py-20">
        <p role="status">영화 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-[1320px] flex-1 px-5 py-20">
        <h1 role="alert" className="mb-4 text-2xl font-bold">
          {getMovieDetailErrorMessage(movieDetailQuery.error)}
        </h1>

        <Link to="/" className="text-blue-600 underline">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const movieDetail = movieDetailQuery.data;
  const posterUrl = getTmdbPosterUrl(movieDetail.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movieDetail.backdrop_path);

  return (
    <main className="flex-1">
      <section className="relative h-[290px] bg-slate-800 text-white">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/10" />

        <div className="relative mx-auto flex h-full max-w-[1320px] flex-col justify-between px-5 py-5">
          <Link
            to="/"
            className="w-fit text-[13px] font-bold hover:underline"
          >
            〈 영화 목록
          </Link>

          <h1 className="mb-2 text-[27px] font-extrabold leading-tight sm:text-4xl">
            {movieDetail.title}
          </h1>

          <p className="mb-2 text-[13px]">
            {movieDetail.original_title}
          </p>

          <p className="text-[13px]">
            {movieDetail.release_date || '개봉일 정보 없음'}
            {' · '}
            {movieDetail.genres.map(genre => genre.name).join(' · ') ||
              '장르 정보 없음'}
            {' · '}
            {movieDetail.runtime != null
              ? `${movieDetail.runtime}분`
              : '상영 시간 정보 없음'}
          </p>
        </div>
      </section>

      <div
        className="
          mx-auto grid max-w-[1320px] gap-6 px-5 py-5
          min-[701px]:grid-cols-[minmax(0,1fr)_290px]
        "
      >
        <section
          aria-label="영화 정보"
          className="flex min-w-0 items-start gap-4 sm:gap-[26px]"
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movieDetail.title} 포스터`}
              className="aspect-[2/3] w-[115px] shrink-0 rounded-[9px] object-cover shadow-lg sm:w-[162px]"
            />
          ) : (
            <div className="flex aspect-[2/3] w-[115px] shrink-0 items-center justify-center rounded-[9px] bg-slate-200 text-xs text-slate-500 sm:w-[162px]">
              포스터 없음
            </div>
          )}

          <div className="min-w-0">
            <h2 className="mb-2.5 text-[17px] font-extrabold">
              {movieDetail.tagline}
            </h2>

            <p className="mb-3 text-[13px] leading-7 text-slate-600">
              {movieDetail.overview}
            </p>

            <button
              type="button"
              aria-pressed={isBookmarked}
              onClick={() => toggleBookmark(movieDetail.id)}
              className={cn(
                'cursor-pointer rounded-md px-3 py-2 text-[13px] font-bold text-white',
                isBookmarked ? 'bg-slate-700' : 'bg-blue-600',
              )}
            >
              {isBookmarked ? '즐겨찾기 해제' : '즐겨찾기'}
            </button>
          </div>
        </section>

        <aside
          className="
            border-t border-gray-200 pt-5
            min-[701px]:border-l min-[701px]:border-t-0
            min-[701px]:pl-6 min-[701px]:pt-0
          "
        >
          <h2 className="mb-1 text-[17px] font-extrabold">
            내 평점
          </h2>

          <RatingEditor movieId={movieId} />
        </aside>
      </div>
    </main>
  );
}