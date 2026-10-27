import { useEffect, useState } from "react";

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
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });

        if (!ignore) {
          const convertedMovies = response.results.map(convertTmdbMovie);
          setMovies(convertedMovies);
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  return (
      <main className="mx-auto w-full max-w-6xl px-8 py-8">
        <h1 className="mb-6 text-3xl font-bold">
          영화 목록
        </h1>

        {isLoading ? (
          <p>영화 목록을 불러오는 중이에요.</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : movies.length === 0 ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <MovieGrid movies={movies} />
        )}
      </main>
  );
}