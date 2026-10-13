import type { Movie } from "../../types/movie";
import type { TmdbMovieDetail, TmdbMovieListItem } from "./models";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

export function toMovie(item: TmdbMovieListItem, isBookmarked: boolean): Movie {
  return {
    id: item.id,
    title: item.title,
    originalTitle: item.original_title,
    releaseDate: item.release_date,
    posterPath: item.poster_path ? `${POSTER_BASE_URL}${item.poster_path}` : "",
    backdropPath: item.backdrop_path
      ? `${BACKDROP_BASE_URL}${item.backdrop_path}`
      : "",
    genres: [], // 목록 응답에는 장르 이름이 없어서 비움
    runtime: "", // 상세 응답에만 있음
    tagline: "", // 상세 응답에만 있음
    overview: item.overview,
    isBookmarked,
  };
}

export function toMovieFromDetail(
  detail: TmdbMovieDetail,
  isBookmarked: boolean,
): Movie {
  return {
    id: detail.id,
    title: detail.title,
    originalTitle: detail.original_title,
    releaseDate: detail.release_date,
    posterPath: detail.poster_path
      ? `${POSTER_BASE_URL}${detail.poster_path}`
      : "",
    backdropPath: detail.backdrop_path
      ? `${BACKDROP_BASE_URL}${detail.backdrop_path}`
      : "",
    genres: detail.genres.map((genre) => genre.name),
    runtime: detail.runtime ? `${detail.runtime}분` : "",
    tagline: detail.tagline,
    overview: detail.overview,
    isBookmarked,
  };
}
