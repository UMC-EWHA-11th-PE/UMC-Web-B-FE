const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

export const env = {
  // TMDB API 설정
  tmdbApiBaseUrl,
  tmdbAccessToken,

  // 기존 코드와의 호환성
  tmdbBaseUrl: tmdbApiBaseUrl,
  tmdbApiKey: import.meta.env.VITE_TMDB_API_KEY,

  // 회원가입 API 서버 주소
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "",
};