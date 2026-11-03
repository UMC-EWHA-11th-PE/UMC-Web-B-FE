import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";

// 공통으로 정의한 영화 Query 설정 가져오기
import { movieQueries } from "../../api/movies/movie-queries";

// TMDB 포스터 경로를 실제 이미지 URL로 변환
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

import { BookmarkButton } from "../../components/bookmark-button";

// HTTP 오류 종류에 따라 검색 오류 메시지를 반환하는 함수
import { getSearchErrorMessage } from "../../utils/movies/get-search-error-message";

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

  // 공통 Query 설정을 사용해 검색 결과 요청 및 상태 관리
  const searchQuery = useQuery(movieQueries.search(normalizedQuery));

  // API 응답에서 영화 목록 추출 (데이터가 없으면 빈 배열)
  const movies = searchQuery.data?.results ?? [];

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
            {searchQuery.isLoading ? (
              // 1. 검색 결과를 처음 불러오는 중
              <p className="mt-8 text-gray-500">
                검색 결과를 불러오는 중이에요.
              </p>
            ) : searchQuery.isError ? (
              // 2. API 요청에 실패한 경우
              <p className="mt-8 text-red-500">
                {getSearchErrorMessage(searchQuery.error)}
              </p>
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
