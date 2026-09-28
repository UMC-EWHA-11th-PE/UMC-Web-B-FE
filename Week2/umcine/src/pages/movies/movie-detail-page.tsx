import { Link, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import {cn} from "../../utils/cn";
import { movies } from '../../data/movie';

export function MovieDetailPage() {
  const { movieId } = useParams({from: '/movies/$movieId'});

  const [bookmarkOverrides, setBookmarkOverrides] = useState<
    Record<number, boolean>
    >({});

  const [reviews, setReviews] = useState<
    Record<number, { rating: number; text: string; saved: boolean }>
    >({});

  const movie = movies.find(item => String(item.id) === movieId);
  if (!movie) return <main className="mx-auto w-full max-w-[1320px] flex-1 px-5 py-20"><h1 className="mb-4 text-2xl font-bold">영화를 찾을 수 없어요.</h1><Link to="/" className="text-blue-600 underline">영화 목록으로 돌아가기</Link></main>;
  
  const isBookmarked=bookmarkOverrides[movie.id]??movie.isBookmarked;
  const review=reviews[movie.id]??{
    rating:0, text:"", saved:false,
  };

  function updateReview(
  changes: Partial<{
    rating: number;
    text: string;
    saved: boolean;
  }>,
) {
  if (!movie) return;

  const movieId = movie.id;

  setReviews((current) => {
    const previousReview = current[movieId] ?? {
      rating: 0,
      text: "",
      saved: false,
    };

    return {
      ...current,
      [movieId]: {
        ...previousReview,
        ...changes,
      },
    };
  });
}
  
  return <main className="flex-1">
    <section className="relative h-[290px] bg-slate-800 text-white">
      <img src={movie.backdropPath} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/10" />
      <div className="relative mx-auto flex h-full max-w-[1320px] flex-col justify-between px-5 py-5">
        <Link to="/" className="w-fit text-[13px] font-bold hover:underline">〈 영화 목록</Link>
        <div><h1 className="mb-2 text-[27px] font-extrabold leading-tight sm:text-4xl">{movie.title}</h1><p className="mb-2 text-[13px]">{movie.originalTitle}</p><p className="text-[13px]">{movie.releaseDate} · {movie.genres.join(' · ')} · {movie.runtime}</p></div>
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
    <img
      src={movie.posterPath}
      alt={`${movie.title} 포스터`}
      className="
        aspect-[2/3] w-[115px] shrink-0 rounded-[9px]
        object-cover shadow-lg sm:w-[162px]
      "
    />

    <div className="min-w-0">
      <h2 className="mb-2.5 text-[17px] font-extrabold">
        {movie.tagline}
      </h2>

      <p className="mb-3 text-[13px] leading-7 text-slate-600">
        {movie.overview}
      </p>

      <button
        type="button"
        aria-pressed={isBookmarked}
        onClick={() =>
          setBookmarkOverrides((current) => ({
            ...current,
            [movie.id]: !isBookmarked,
          }))
        }
        className={cn(
          "cursor-pointer rounded-md px-3 py-2 text-[13px] font-bold text-white",
          isBookmarked ? "bg-slate-700" : "bg-blue-600",
        )}
      >
        {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
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

    <p className="mb-2 text-xs text-slate-500">
      별점은 필수, 후기는 선택이에요.
    </p>

    <div
      role="group"
      aria-label="평점 선택"
      className="mb-2 flex gap-1"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star}점`}
          aria-pressed={review.rating === star}
          onClick={() =>
            updateReview({ rating: star, saved: false })
          }
          className={cn(
            "grid size-8 cursor-pointer place-items-center rounded-md border bg-white",
            star <= review.rating
              ? "border-amber-400"
              : "border-slate-200",
          )}
        >
          <img
            src={
              star <= review.rating
                ? "/icons/star.svg"
                : "/icons/star-outline.svg"
            }
            alt=""
            className="size-5"
          />
        </button>
      ))}
    </div>

    <textarea
      aria-label="영화 후기"
      placeholder="영화를 보고 느낀 점을 남겨보세요"
      value={review.text}
      onChange={(event) =>
        updateReview({
          text: event.target.value,
          saved: false,
        })
      }
      className="
        block h-[82px] w-full resize-y rounded-md
        border border-slate-200 bg-white p-3 text-xs
        focus:outline-2 focus:outline-blue-500
      "
    />

    <button
      type="button"
      disabled={review.rating === 0}
      onClick={() => updateReview({ saved: true })}
      className="
        mt-2 w-full cursor-pointer rounded-md
        bg-[#20242c] py-2.5 text-[13px] font-bold text-white
        disabled:cursor-not-allowed disabled:opacity-40
      "
    >
      평점 저장
    </button>

    <p role="status" className="mt-2 text-xs text-slate-500">
      {review.saved
        ? "현재 화면에 평점을 저장했어요."
        : "평점과 후기는 새로고침하면 초기화돼요."}
    </p>
  </aside>
</div>
  </main>;
}

