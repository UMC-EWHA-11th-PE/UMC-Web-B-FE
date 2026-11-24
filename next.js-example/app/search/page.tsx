import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import type { TmdbMovieListResponse } from "../movies/models";

type SearchPageProps = {
  searchParams: Promise<{ query?: string | string[] }>;
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <main className="mx-auto w-full max-w-[1320px] flex-1 px-5 pb-16 pt-5">
      <h1 className="mb-4 text-3xl font-extrabold">영화 검색</h1>

      <Suspense fallback={<p role="status">검색 화면을 불러오는 중이에요.</p>}>
        <SearchContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function SearchContent({ searchParams }: SearchPageProps) {
  const { query: rawQuery } = await searchParams;
  const query = typeof rawQuery === "string" ? rawQuery.trim() : "";

  return (
    <>
      <form action="/search" method="get" className="flex max-w-xl gap-2">
        <input
          type="search"
          name="query"
          defaultValue={query}
          aria-label="영화 제목"
          placeholder="영화 제목을 검색해 보세요"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
        />
        <button
          type="submit"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold text-white"
        >
          검색
        </button>
      </form>

      {query ? (
        <Suspense
          key={query}
          fallback={
            <p role="status" className="mt-6">
              검색 결과를 불러오는 중이에요.
            </p>
          }
        >
          <SearchResults query={query} />
        </Suspense>
      ) : (
        <p className="mt-6 text-sm text-slate-500">검색어를 입력해 주세요.</p>
      )}
    </>
  );
}

async function SearchResults({ query }: { query: string }) {
  let movies: TmdbMovieListResponse["results"];

  try {
    const data = await searchMovies(query);
    movies = data.results;
  } catch {
    return (
      <p role="alert" className="mt-6 text-sm text-red-600">
        검색 결과를 불러오지 못했어요. 검색 버튼을 눌러 다시 시도해 주세요.
      </p>
    );
  }

  return (
    <section className="mt-6" aria-labelledby="search-results-heading">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <h2 id="search-results-heading" className="break-all text-lg font-bold">
          ‘{query}’ 검색 결과
        </h2>
        <p className="text-sm text-slate-500">불러온 영화 {movies.length}편</p>
      </div>

      {movies.length === 0 ? (
        <p className="py-8 text-sm text-slate-500">조건에 맞는 영화가 없어요.</p>
      ) : (
        <ul className="grid gap-x-7 min-[701px]:grid-cols-2">
          {movies.map((movie) => (
            <li key={movie.id} className="border-b border-slate-200 py-4">
              <Link
                href={`/movies/${movie.id}`}
                className="flex items-start gap-4 rounded-lg hover:bg-slate-100/50"
              >
                <div className="relative h-[166px] w-[110px] shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt=""
                      fill
                      sizes="110px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="grid h-full place-items-center text-xs text-slate-500">
                      포스터 없음
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="mb-1 font-extrabold">{movie.title}</h3>
                  {movie.original_title !== movie.title && (
                    <p className="text-xs text-slate-500">{movie.original_title}</p>
                  )}
                  <p className="mb-2 text-xs text-slate-500">
                    {movie.release_date || "개봉일 정보 없음"}
                  </p>
                  <p className="line-clamp-4 text-sm leading-relaxed">
                    {movie.overview || "줄거리 정보가 없어요."}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

async function searchMovies(query: string): Promise<TmdbMovieListResponse> {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN이 설정되지 않았어요.");
  }

  const url = new URL("https://api.themoviedb.org/3/search/movie");
  url.search = new URLSearchParams({
    query,
    language: "ko-KR",
    include_adult: "false",
    page: "1",
  }).toString();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB 영화 검색 요청 실패 (${response.status})`);
  }

  return response.json();
}