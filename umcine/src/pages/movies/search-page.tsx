import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  //검색할 때는 trim()으로 앞뒤 공백 없앰 + toLowerCase()로 영어를 소문자 맞춤
  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
  //movies.filter로 조건에 맞는 영화만 남김
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  //검색 버튼 누르면 
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    //event.preventDefault()로 페이지를 새로고침하는 행동을 막음
    event.preventDefault();
    const nextQuery = searchText.trim();
    //navigate()가 url을 /search -> //search?query=검색어로 변경
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

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 rounded-xl border border-gray-400 bg-white p-3 shadow-lg"
        >
          <img
            src="/icons/search.svg"
            alt=""
            className="h-5 w-5"
          />

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

        {!normalizedQuery ? (
          <p className="mt-6 text-center text-sm text-gray-500">
            검색어를 입력해 주세요.
          </p>
        ) : (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">
              ‘{query}’ 검색 결과
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              영화 {searchResults.length}편
            </p>

            {searchResults.length === 0 ? (
              <p className="mt-8 text-gray-500">
                검색 결과가 없어요.
              </p>
            ) : (
              <ul className="mt-8 grid gap-6 sm:grid-cols-2">
                {searchResults.map((movie) => (
                  <li
                    key={movie.id}
                    className="flex gap-4 rounded-xl bg-white p-4 shadow-sm"
                  >
                    <img
                      className="h-40 w-28 shrink-0 rounded-lg object-cover"
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                    />

                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {movie.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {movie.originalTitle}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {movie.releaseDate}
                      </p>

                      <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                        {movie.overview}
                      </p>

                      <Link
                        className="mt-3 inline-block text-sm font-semibold text-blue-600"
                        to="/movies/$movieId"
                        params={{
                          movieId: String(movie.id),
                        }}
                      >
                        상세 보기
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}