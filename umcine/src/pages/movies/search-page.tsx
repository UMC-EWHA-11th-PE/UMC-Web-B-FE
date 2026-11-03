import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toMovie } from "../../api/movies/mappers";
import { searchMovies } from "../../api/movies/search-movies";
import MovieGrid from "../../components/movies/movie-grid";
import { useBookmarkStore } from "../../stores/bookmark-store";

function SearchForm({ initialQuery }: { initialQuery: string }) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(initialQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
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
  );
}

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const normalizedQuery = query?.trim() ?? "";

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const resultMovies = (searchQuery.data?.results ?? []).map((movie) =>
    toMovie(movie, bookmarkedMovieIds.includes(movie.id)),
  );

  return (
    <main className="mx-auto max-w-[1200px] px-10 py-8">
      <h1 className="mb-5 text-2xl">영화 검색</h1>
      <SearchForm key={query ?? ""} initialQuery={query ?? ""} />

      {!normalizedQuery ? (
        <p className="text-gray-500">검색어를 입력해 주세요.</p>
      ) : searchQuery.isLoading ? (
        <p className="text-gray-500">검색 중...</p>
      ) : searchQuery.isError ? (
        <p role="alert" className="text-red-600">
          검색 결과를 불러오지 못했어요.
        </p>
      ) : (
        <>
          <h2 className="mb-1 text-lg font-bold">'{query}' 검색 결과</h2>
          <p className="mb-5 text-sm text-gray-500">
            영화 {resultMovies.length}편
          </p>
          {resultMovies.length === 0 ? (
            <p className="text-gray-500">검색 결과가 없어요.</p>
          ) : (
            <MovieGrid
              movies={resultMovies}
              onToggleBookmark={toggleBookmark}
            />
          )}
        </>
      )}
    </main>
  );
}
