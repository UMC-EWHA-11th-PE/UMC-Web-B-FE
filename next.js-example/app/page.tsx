import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookmarkButton } from "@/app/components/bookmark-button";
import type { TmdbMovieListResponse } from "../app/movies/models";

type SearchParams = Promise<{ page?: string | string[] }>;

const MAX_PAGE = 500;

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 pb-20 pt-[26px] sm:px-5">
      <h1 className="mb-[18px] text-3xl font-extrabold">영화 목록</h1>

      <Suspense fallback={<p role="status">영화 목록을 불러오는 중이에요.</p>}>
        <MovieList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function MovieList({ searchParams }: { searchParams: SearchParams }) {
  const { page: rawPage } = await searchParams;
  const page =
    typeof rawPage === "string" && /^\d+$/.test(rawPage)
      ? Math.min(MAX_PAGE, Math.max(1, Number(rawPage)))
      : 1;

  let data: TmdbMovieListResponse;

  try {
    data = await getPopularMovies(page);
  } catch {
    return (
      <div>
        <p role="alert">영화 목록을 불러오지 못했어요.</p>
        <a
          href={pageHref(page)}
          className="mt-3 inline-block rounded bg-blue-600 px-4 py-2 text-sm text-white"
        >
          다시 시도
        </a>
      </div>
    );
  }

  const totalPages = Math.min(data.total_pages, MAX_PAGE);
  const firstPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const lastPage = Math.min(totalPages, firstPage + 4);
  const pages = Array.from(
    { length: Math.max(0, lastPage - firstPage + 1) },
    (_, index) => firstPage + index,
  );

  return (
    <>
      {data.results.length === 0 ? (
        <p role="status">표시할 영화가 없어요.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 min-[521px]:grid-cols-3 min-[801px]:grid-cols-5">
          {data.results.map((movie) => (
            <article key={movie.id} className="relative-min-w-0">
              <Link href={`/movies/${movie.id}`} className="block">
              <div className="absolute right-2 top-2">
                <BookmarkButton movieId={movie.id} title={movie.title} compact />
              </div>
                <div className="relative aspect-[0.88] overflow-hidden rounded-[9px]">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt=""
                      fill
                      sizes="(max-width: 520px) 50vw, (max-width: 800px) 33vw, (max-width: 1320px) 20vw, 250px"
                      className="object-cover transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-slate-200 text-sm text-slate-600">
                      포스터 없음
                    </div>
                  )}
                </div>
                <h2 className="mb-[3px] mt-2 truncate text-sm font-extrabold">
                  {movie.title}
                </h2>
              </Link>
              <p className="text-xs text-slate-500">
                {movie.release_date || "개봉일 정보 없음"}
              </p>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="페이지 이동" className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Link href={pageHref(page - 1)} aria-label="이전 페이지" className="px-2 py-1">
              ‹
            </Link>
          )}
          {pages.map((number) => (
            <Link
              key={number}
              href={pageHref(number)}
              aria-label={`${number}페이지`}
              aria-current={number === page ? "page" : undefined}
              className={
                number === page
                  ? "rounded bg-slate-800 px-2 py-1 text-white"
                  : "rounded px-2 py-1"
              }
            >
              {number}
            </Link>
          ))}
          {page < totalPages && (
            <Link href={pageHref(page + 1)} aria-label="다음 페이지" className="px-2 py-1">
              ›
            </Link>
          )}
        </nav>
      )}
    </>
  );
}

function pageHref(page: number) {
  return page === 1 ? "/" : `/?page=${page}`;
}

async function getPopularMovies(page: number): Promise<TmdbMovieListResponse> {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN이 설정되지 않았어요.");
  }

  const url = new URL("https://api.themoviedb.org/3/movie/popular");
  url.searchParams.set("language", "ko-KR");
  url.searchParams.set("page", String(page));

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB 영화 목록 요청 실패 (${response.status})`);
  }

  return response.json();
}