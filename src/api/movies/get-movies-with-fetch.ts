import { env } from "../../config/env";
import type { TmdbMovieListResponse } from "./models";

type GetMoviesWithFetchResponse = TmdbMovieListResponse; 
//models.ts 파일에서 작성했던 형식대로 데이터를 받아옴

async function getMoviesWithFetch( //데이터를 요청하는 함수
  page = 1,
): Promise<GetMoviesWithFetchResponse> { //Promise를 이용하여 비동기처리
  const searchParams = new URLSearchParams({ //서버에 어떤 조건으로 요청할 건지
    language: "ko-KR",
    page: String(page),
  });

  const response = await fetch( //실제로 서버에 요청을 보내는 함수 (응답을 받아옴)
    `${env.tmdbApiBaseUrl}/movie/popular?${searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${env.tmdbAccessToken}`, //헤더에 인증토큰
      },
    },
  );

  if (!response.ok) { //요청에 대한 응답을 직 확인
    throw new Error(`영화 목록 요청에 실패했어요: ${response.status}`);
  }

  return response.json(); //json형식으로 데이터를 반환
}

export { getMoviesWithFetch, type GetMoviesWithFetchResponse };