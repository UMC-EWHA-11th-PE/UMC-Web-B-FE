
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import MovieGrid from "../../components/movies/movie-grid";

import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import type { Movie } from "../../types/movie";

// TMDB 이미지 주소
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// TMDB 장르 ID를 장르 이름으로 변환
const genreMap: Record<number, string> = {
  28: "액션",
  12: "모험",
  16: "애니메이션",
  35: "코미디",
  80: "범죄",
  99: "다큐멘터리",
  18: "드라마",
  10751: "가족",
  14: "판타지",
  36: "역사",
  27: "공포",
  10402: "음악",
  9648: "미스터리",
  10749: "로맨스",
  878: "SF",
  53: "스릴러",
  10752: "전쟁",
  37: "서부",
};

// TMDB 데이터를 기존 Movie 타입으로 변환
function convertTmdbMovie(movie: TmdbMovieListItem): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date.replaceAll("-", "."),
    posterPath: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : "",
    backdropPath: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : "",
    genres: movie.genre_ids.map((id) => genreMap[id] ?? "기타"),
    runtime: "",
    tagline: "",
    overview: movie.overview,
    isBookmarked: false,
  };
}

export function MovieListPage() {
  const [page, setPage] = useState(1);

  // TanStack Query로 영화 목록 조회
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  // TMDB 데이터를 기존 Movie 타입으로 변환
  const movies = (moviesQuery.data?.results ?? []).map(convertTmdbMovie);
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  // 페이지 변경
  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  // 페이지 번호 생성 (최대 5개)
  const startPage = Math.max(
    1,
    Math.min(page - 2, totalPages - 4)
  );

  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => startPage + index
  );

  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-8 py-8">
        <h1 className="mb-6 text-3xl font-bold">
          영화 목록
        </h1>

        {moviesQuery.isPending ? (
          <p>영화 목록을 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p>영화 목록을 불러오지 못했어요.</p>
        ) : movies.length === 0 ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid movies={movies} />

            {/* 페이지네이션 */}
            <div className="mt-8 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="rounded border px-3 py-2 disabled:opacity-50"
              >
                이전
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`rounded border px-3 py-2 ${
                    page === pageNumber
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="rounded border px-3 py-2 disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </>
        )}
      </main>

    </>
  );
}
