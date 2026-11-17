import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  /* 검색어가 없는 초기 검색 화면 */
  if (!normalizedQuery) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-gray-50">
        <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-40">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            어떤 영화를 찾고 있나요?
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-10 flex w-full max-w-2xl items-center rounded-xl border-2 border-gray-800 bg-white p-2 shadow-sm"
          >
            <img
              src="/icons/movie-icons/search.svg"
              alt=""
              className="ml-3 h-5 w-5 opacity-60"
            />

            <input
              aria-label="검색어"
              placeholder="예: 스파이더맨"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
            >
              검색
            </button>
          </form>
        </section>
      </main>
    );
  }

  /* 검색 결과 화면 */
  return (
    <main className="min-h-[calc(100vh-72px)] bg-gray-50">
      <section className="mx-auto max-w-6xl px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">
          영화 검색
        </h1>

        {/* 검색창 */}
        <form
          onSubmit={handleSubmit}
          className="mt-5 flex w-full items-center rounded-lg border border-gray-200 bg-white px-3 py-2"
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="h-5 w-5 opacity-60"
          />

          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm outline-none"
          />

          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={() => setSearchText("")}
            className="mr-3 text-xl text-gray-500"
          >
            ×
          </button>

          <button
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
          >
            다시 검색
          </button>
        </form>

        {/* 검색 결과 제목 */}
        <div className="mt-4 flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-sm font-bold text-gray-900">
            ‘{query}’ 검색 결과
          </h2>

          <p className="text-xs text-gray-400">
            영화 {searchResults.length}편
          </p>
        </div>

        {searchResults.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-gray-500">
              검색 결과가 없어요.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2">
            {searchResults.map((movie) => (
              <li
                key={movie.id}
                className="flex gap-4 border-b border-gray-200 py-5 md:pr-8"
              >
                {/* 포스터 */}
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="shrink-0"
                >
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="h-[160px] w-[105px] rounded-lg object-cover"
                  />
                </Link>

                {/* 영화 정보 */}
                <div className="min-w-0 py-1">
                  <h3 className="text-base font-bold text-gray-900">
                    {movie.title}
                  </h3>

                  <BookmarkButton movieId={movie.id} />

                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>{movie.originalTitle}</span>
                    <span>{movie.releaseDate}</span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                    {movie.overview}
                  </p>

                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="mt-5 inline-block text-sm font-semibold text-blue-600"
                  >
                    상세 보기 →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}