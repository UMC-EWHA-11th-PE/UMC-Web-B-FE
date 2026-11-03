
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../../api/movies/search-movies";
import type { Movie } from "../../types/movie";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { useBookmarkStore } from "../../utils/bookmark-storage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const [searchText, setSearchText] = useState(query ?? "");

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim() ?? "";

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: async () => {
      const response = await searchMovies({
        query: normalizedQuery,
        page: 1,
      });

      const mappedMovies: Movie[] = response.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        originalTitle: movie.original_title,
        releaseDate: movie.release_date,
        posterPath: movie.poster_path ?? "",
        backdropPath: movie.backdrop_path ?? "",
        genres: [],
        runtime: "",
        tagline: "",
        overview: movie.overview,
        isBookmarked: false,
      }));

      return mappedMovies;
    },
    enabled: normalizedQuery.length > 0,
  });

  const movies = searchQuery.data ?? [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="search-page">
      <div className="search-container">
        <h1 className="search-title">영화 검색</h1>

        <form
          className={`search-form ${
            !normalizedQuery ? "search-form-center" : ""
          }`}
          onSubmit={handleSubmit}
        >
          <div className="search-input-wrapper">
            <img
              src="/icons/movie-icons/search.svg"
              alt=""
              className="search-input-icon"
            />

            <input
              aria-label="검색어"
              placeholder="영화 제목을 검색해보세요"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />

            {searchText && (
              <button
                type="button"
                className="search-clear-button"
                onClick={() => setSearchText("")}
                aria-label="검색어 지우기"
              >
                ×
              </button>
            )}
          </div>

          <button type="submit" className="search-submit-button">
            검색
          </button>
        </form>

        {!normalizedQuery && (
          <section className="search-empty">
            <h2>어떤 영화를 찾고 있나요?</h2>
          </section>
        )}

        {normalizedQuery && (
          <section className="search-results">
            <div className="search-result-header">
              <h2>‘{normalizedQuery}’ 검색 결과</h2>

              {!searchQuery.isPending && !searchQuery.isError && (
                <p>영화 {movies.length}편</p>
              )}
            </div>

            {searchQuery.isPending ? (
              <p>검색 결과를 불러오는 중이에요...</p>
            ) : searchQuery.isError ? (
              <div className="no-search-result">
                <p>검색 결과를 불러오지 못했어요.</p>
              </div>
            ) : movies.length === 0 ? (
              <div className="no-search-result">
                <p>검색 결과가 없어요.</p>
              </div>
            ) : (
              <ul className="search-result-list">
                {movies.map((movie) => {
                  const isBookmarked = bookmarkedMovieIds.includes(
                    movie.id,
                  );

                  const posterUrl = getTmdbPosterUrl(movie.posterPath);

                  return (
                    <li
                      key={movie.id}
                      className="search-result-item"
                    >
                      <div className="search-result-poster-wrapper">
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={`${movie.title} 포스터`}
                            className="search-result-poster"
                          />
                        ) : (
                          <div
                            className="search-result-poster"
                            role="img"
                            aria-label={`${movie.title} 포스터 없음`}
                          >
                            이미지 없음
                          </div>
                        )}

                        <button
                          type="button"
                          className={`search-result-bookmark ${
                            isBookmarked ? "is-bookmarked" : ""
                          }`}
                          onClick={() => toggleBookmark(movie.id)}
                          aria-label={
                            isBookmarked
                              ? `${movie.title} 북마크 해제`
                              : `${movie.title} 북마크`
                          }
                        >
                          <img
                            src={
                              isBookmarked
                                ? "/icons/movie-icons/bookmark.svg"
                                : "/icons/movie-icons/bookmark-outline.svg"
                            }
                            alt=""
                          />
                        </button>
                      </div>

                      <div className="search-result-info">
                        <h3>{movie.title}</h3>

                        <p className="original-title">
                          {movie.originalTitle}
                        </p>

                        <p className="release-date">
                          {movie.releaseDate}
                        </p>

                        <p className="overview">
                          {movie.overview}
                        </p>

                        <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                          className="detail-link"
                        >
                          상세 보기 →
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}
      </div>

      <ReactQueryDevtools initialIsOpen={true} />
    </main>
  );
}
