import { queryOptions } from "@tanstack/react-query";

import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";
import { getMovieDetail } from "./get-movie-detail";

// 영화 관련 Query 설정을 한곳에서 관리
export const movieQueries = {
  // 영화 목록: 페이지 번호별로 캐시 구분
  list: (page: number) =>
    queryOptions({
      queryKey: ["movies", "list", { page }],
      queryFn: () => getMovies({ page }),
    }),

  // 영화 검색: 검색어별로 캐시 구분
  search: (query: string) =>
    queryOptions({
      queryKey: ["movies", "search", { query }],
      queryFn: () => searchMovies({ query }),

      // 검색어가 있을 때만 API 요청
      enabled: query.length > 0,
    }),

  // 영화 상세: 영화 ID별로 캐시 구분
  detail: (movieId: number) =>
    queryOptions({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),

      // 유효한 영화 ID일 때만 API 요청
      enabled: Number.isInteger(movieId) && movieId > 0,

      // 상세 정보는 30초 동안 최신 상태로 취급
      staleTime: 30 * 1000,
    }),
};
