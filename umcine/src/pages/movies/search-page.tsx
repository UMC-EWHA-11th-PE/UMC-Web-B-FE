import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { movies } from "../../data/movies";

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto max-w-[1200px] px-10 py-8">
      <h1 className="mb-5 text-2xl">영화 검색</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="text-gray-500">검색어를 입력해 주세요.</p>
      ) : (
        <>
          <h2 className="mb-1 text-lg font-bold">'{query}' 검색 결과</h2>
          <p className="mb-5 text-sm text-gray-500">영화 {searchResults.length}편</p>
          {searchResults.length === 0 ? (
            <p className="text-gray-500">검색 결과가 없어요.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {searchResults.map((movie) => (
                <li key={movie.id} className="rounded-lg border border-gray-200 p-3">
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="mb-2 aspect-[2/3] w-full rounded-md object-cover"
                  />
                  <h3 className="text-sm font-semibold">{movie.title}</h3>
                  <p className="text-xs text-gray-500">{movie.originalTitle}</p>
                  <p className="text-xs text-gray-500">{movie.releaseDate}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                    {movie.overview}
                  </p>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="mt-2 inline-block text-xs font-semibold text-blue-600"
                  >
                    상세 보기
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}