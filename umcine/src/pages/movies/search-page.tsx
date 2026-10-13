import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toMovie } from "../../api/movies/mappers";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import MovieGrid from "../../components/movies/movie-grid";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const [tmdbMovies, setTmdbMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizedQuery = query?.trim() ?? "";

  useEffect(() => {
    if (!normalizedQuery) return;

    let ignore = false;

    async function loadSearchResults() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await searchMovies({ query: normalizedQuery });
        if (!ignore) setTmdbMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadSearchResults();
    return () => {
      ignore = true;
    };
  }, [normalizedQuery]);

  const resultMovies = normalizedQuery
    ? tmdbMovies.map((movie) =>
        toMovie(movie, bookmarkedMovieIds.includes(movie.id)),
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
      ) : isLoading ? (
        <p className="text-gray-500">검색 중...</p>
      ) : errorMessage ? (
        <p role="alert" className="text-red-600">
          {errorMessage}
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
