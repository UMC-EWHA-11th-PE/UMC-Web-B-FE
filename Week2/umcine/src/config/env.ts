const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


if (!tmdbApiBaseUrl || !tmdbAccessToken || !apiBaseUrl) {
  throw new Error("필요한 환경 변수가 설정되지 않았어요.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  apiBaseUrl,
};