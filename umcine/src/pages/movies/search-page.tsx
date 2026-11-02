import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";

// 기존 직접 작성한 movies 배열 대신 TMDB 검색 API 사용
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";

// TMDB 포스터 경로를 실제 이미지 URL로 변환
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

import { BookmarkButton } from "../../components/bookmark-button";

// 검색 요청의 결과와 검색어를 함께 저장하는 타입
interface SearchResultState {
  query: string;
  movies: TmdbMovieListItem[];
  errorMessage: string | null;
}

export function SearchPage() {
  // URL의 query search param 가져오기
  const { query } = useSearch({ from: "/search" });

  // 검색 버튼을 누르면 URL을 변경하기 위해 사용
  const navigate = useNavigate({ from: "/search" });

  // 검색창에 입력한 문자열 관리
  const [searchText, setSearchText] = useState(query ?? "");

  // 검색어 앞뒤 공백 제거
  // 기존에는 toLowerCase()도 사용했지만,
  // 이제 검색은 TMDB 서버가 처리하므로 소문자로 변환할 필요 없음
  const normalizedQuery = query?.trim() ?? "";

  // API 응답을 검색어와 함께 저장
  // 검색어가 변경되었을 때 이전 결과가 표시되지 않도록 하기 위함
  const [searchResult, setSearchResult] = useState<SearchResultState | null>(
    null,
  );

  // 현재 URL의 검색어와 응답의 검색어가 같을 때만 결과 사용
  const currentResult =
    searchResult?.query === normalizedQuery ? searchResult : null;

  // 검색어가 있는데 현재 검색어에 대한 결과가 없다면 로딩 중
  const isLoading = normalizedQuery !== "" && currentResult === null;

  // 현재 검색어에 해당하는 영화 목록
  const movies = currentResult?.movies ?? [];

  // 현재 검색어에 해당하는 오류 메시지
  const errorMessage = currentResult?.errorMessage ?? null;

  // 검색어가 변경될 때마다 TMDB API 요청
  useEffect(() => {
    // 검색어가 비어 있으면 API 요청하지 않음
    if (!normalizedQuery) {
      return;
    }

    // 이전 요청 결과가 현재 검색 결과를 덮어쓰지 않도록 방지
    let ignore = false;

    // TMDB API에서 검색 결과 가져오기
    searchMovies({ query: normalizedQuery })
      .then((response) => {
        // 요청이 유효하다면 검색 결과 저장
        if (!ignore) {
          setSearchResult({
            query: normalizedQuery,
            movies: response.results,
            errorMessage: null,
          });
        }
      })
      .catch(() => {
        // API 요청에 실패하면 오류 메시지 저장
        if (!ignore) {
          setSearchResult({
            query: normalizedQuery,
            movies: [],
            errorMessage: "검색 결과를 불러오지 못했어요.",
          });
        }
      });

    // 검색어 변경 또는 컴포넌트 정리 시 이전 요청 결과 무시
    return () => {
      ignore = true;
    };
  }, [normalizedQuery]);

  // 검색 버튼을 누르면 실행
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    // 페이지가 새로고침되는 기본 동작 방지
    event.preventDefault();

    const nextQuery = searchText.trim();

    // navigate()가 URL을 /search?query=검색어 형태로 변경
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          어떤 영화를 찾고 있나요?
        </h1>

        {/* 기존 검색창 디자인 유지 */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 rounded-xl border border-gray-400 bg-white p-3 shadow-lg"
        >
          <img src="/icons/search.svg" alt="" className="h-5 w-5" />

          <input
            aria-label="검색어"
            placeholder="예: 스파이더맨"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="min-w-0 flex-1 border-none bg-transparent px-2 py-2 text-sm outline-none"
          />

          <button
            type="submit"
            className="cursor-pointer rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
          >
            검색
          </button>
        </form>

        {/* 검색어가 없으면 안내 메시지 표시 */}
        {!normalizedQuery ? (
          <p className="mt-6 text-center text-sm text-gray-500">
            검색어를 입력해 주세요.
          </p>
        ) : (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">
              ‘{query}’ 검색 결과
            </h2>

            {/* API 요청 상태에 따라 다른 화면 표시 */}
            {isLoading ? (
              // 1. 검색 결과를 불러오는 중
              <p className="mt-8 text-gray-500">
                검색 결과를 불러오는 중이에요.
              </p>
            ) : errorMessage ? (
              // 2. API 요청에 실패한 경우
              <p className="mt-8 text-red-500">{errorMessage}</p>
            ) : (
              // 3. API 요청에 성공한 경우
              <>
                {/* 현재 페이지에서 받아온 영화 개수 */}
                <p className="mt-2 text-sm text-gray-500">
                  영화 {movies.length}편
                </p>

                {movies.length === 0 ? (
                  // 검색 결과가 없는 경우
                  <p className="mt-8 text-gray-500">검색 결과가 없어요.</p>
                ) : (
                  // 검색 결과가 있으면 영화 카드 표시
                  <ul className="mt-8 grid gap-6 sm:grid-cols-2">
                    {movies.map((movie) => {
                      // TMDB 포스터 경로를 실제 이미지 URL로 변환
                      const posterUrl = getTmdbPosterUrl(movie.poster_path);

                      return (
                        <li
                          key={movie.id}
                          className="flex gap-4 rounded-xl bg-white p-4 shadow-sm"
                        >
                          {/* 포스터가 없으면 이미지 없음 표시 */}
                          {posterUrl ? (
                            <img
                              className="h-40 w-28 shrink-0 rounded-lg object-cover"
                              src={posterUrl}
                              alt={`${movie.title} 포스터`}
                            />
                          ) : (
                            <div className="flex h-40 w-28 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                              이미지 없음
                            </div>
                          )}

                          <div className="min-w-0">
                            {/* TMDB 영화 제목 */}
                            <h3 className="font-semibold text-gray-900">
                              {movie.title}
                            </h3>

                            {/* TMDB 원제 */}
                            <p className="mt-1 text-sm text-gray-500">
                              {movie.original_title}
                            </p>

                            {/* TMDB 개봉일 */}
                            <p className="mt-1 text-sm text-gray-500">
                              {movie.release_date}
                            </p>

                            {/* TMDB 영화 줄거리 */}
                            <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                              {movie.overview}
                            </p>

                            {/* 기존 영화 상세 페이지 이동 기능 유지 */}
                            <Link
                              className="mt-3 inline-block text-sm font-semibold text-blue-600"
                              to="/movies/$movieId"
                              params={{
                                movieId: String(movie.id),
                              }}
                            >
                              상세 보기
                            </Link>

                            {/* 기존 Zustand 북마크 기능 유지 */}
                            <div className="mt-3">
                              <BookmarkButton movieId={movie.id} />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
