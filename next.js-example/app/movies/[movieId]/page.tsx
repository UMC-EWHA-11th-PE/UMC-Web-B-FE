//상세보기
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookmarkButton } from "@/app/components/bookmark-button";
import { RatingEditor } from "@/app/components/rating-editor";

import type { TmdbMovieDetail } from "../models"

type MovieDetailProps = {
  params: Promise<{ movieId: string }>;
};

const imageBaseUrl = "https://image.tmdb.org/t/p";

export default function MovieDetailPage({ params }: MovieDetailProps) {
  return (
    <main className="flex-1">
      <Suspense
        fallback={
          <p role="status" className="mx-auto max-w-[1320px] px-5 py-20">
            영화 정보를 불러오는 중이에요.
          </p>
        }
      >
        <MovieDetail params={params} />
      </Suspense>
    </main>
  );
}

async function MovieDetail({ params }: MovieDetailProps) {
  const { movieId } = await params;
  const id = Number(movieId);

  if (!/^\d+$/.test(movieId) || !Number.isSafeInteger(id) || id < 1) {
    return <DetailMessage message="올바르지 않은 영화 번호예요." />;
  }

  let movie: TmdbMovieDetail | null;

  try {
    movie = await getMovieDetail(id);
  } catch {
    return <DetailMessage message="영화 정보를 불러오지 못했어요." />;
  }

  if (!movie) {
    return <DetailMessage message="영화를 찾을 수 없어요." />;
  }

  const genres = movie.genres.map((genre) => genre.name).join(" · ");

  return (
    <>
      <section className="relative min-h-[290px] bg-slate-800 text-white">
        {movie.backdrop_path && (
          <Image
            src={`${imageBaseUrl}/w1280${movie.backdrop_path}`}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}

        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/30" />

        <div className="relative mx-auto flex min-h-[290px] max-w-[1320px] flex-col justify-between gap-10 px-5 py-5">
          <Link href="/" className="w-fit text-sm font-bold hover:underline">
            〈 영화 목록
          </Link>

          <div>
            <h1 className="mb-2 text-3xl font-extrabold sm:text-4xl">
              {movie.title}
            </h1>
            {movie.original_title !== movie.title && (
              <p className="mb-2 text-sm">{movie.original_title}</p>
            )}
            <p className="text-sm">
              {movie.release_date || "개봉일 정보 없음"}
              {" · "}
              {genres || "장르 정보 없음"}
              {" · "}
              {movie.runtime != null
                ? `${movie.runtime}분`
                : "상영 시간 정보 없음"}
            </p>
          </div>
        </div>
      </section>

      <section
      aria-label="영화 정보"
      className="mx-auto grid w-full max-w-[1320px] grid-cols-[auto_minmax(0,1fr)] items-start gap-4 px-5 py-5 sm:gap-6 lg:grid-cols-[auto_minmax(0,1fr)_minmax(240px,300px)]"
      >
        <div className="relative aspect-[2/3] w-[115px] shrink-0 overflow-hidden rounded-[9px] shadow-lg sm:w-[162px]">
          {movie.poster_path ? (
            <Image
              src={`${imageBaseUrl}/w500${movie.poster_path}`}
              alt={`${movie.title} 포스터`}
              fill
              sizes="(min-width: 640px) 162px, 115px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center bg-slate-200 text-xs text-slate-600">
              포스터 없음
            </div>
          )}
        </div>

        <div className="min-w-0">
          {movie.tagline && (
            <p className="mb-2.5 text-lg font-extrabold">{movie.tagline}</p>
          )}
          <h2 className="mb-2 font-bold">줄거리</h2>
          <p className="text-sm leading-7">
            {movie.overview || "등록된 줄거리가 없어요."}
          </p>
        </div>

        <aside
          aria-label="즐겨찾기와 내 평점"
          className="col-span-2 min-w-0 lg:col-span-1"
        >
          <div className="flex justify-end whitespace-nowrap">
            <BookmarkButton movieId={movie.id} title={movie.title} />
          </div>

          <section aria-labelledby="my-rating-heading" className="mt-4">
            <h2 id="my-rating-heading" className="mb-3 text-lg font-extrabold">
              내 평점
            </h2>
            <RatingEditor movieId={movie.id} />
          </section>
        </aside>
      </section>
    </>
  );
}

function DetailMessage({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-[1320px] px-5 py-20">
      <h1 className="mb-4 text-2xl font-bold">{message}</h1>
      <Link href="/" className="text-blue-600 underline">
        영화 목록으로 돌아가기
      </Link>
    </div>
  );
}

async function getMovieDetail(id: number): Promise<TmdbMovieDetail | null> {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN이 설정되지 않았어요.");
  }

  const url = new URL(`https://api.themoviedb.org/3/movie/${id}`);
  url.searchParams.set("language", "ko-KR");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(`TMDB 영화 상세 요청 실패 (${response.status})`);
  }

  return response.json();
}