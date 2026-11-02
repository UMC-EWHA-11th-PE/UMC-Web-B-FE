// TMDB에서 제공하는 이미지 기본 URL
const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

// 영화 포스터 경로를 실제 이미지 URL로 변환
export function getTmdbPosterUrl(posterPath: string | null) {
  return posterPath ? `${TMDB_POSTER_BASE_URL}${posterPath}` : null;
}

// 영화 상세 화면의 배경 이미지 URL로 변환
export function getTmdbBackdropUrl(backdropPath: string | null) {
  return backdropPath ? `${TMDB_BACKDROP_BASE_URL}${backdropPath}` : null;
}
