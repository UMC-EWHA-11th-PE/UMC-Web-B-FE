import {env} from '../../config/env';
import type { TmdbMovieListResponse } from './models';
/*
TMDB API에 인기 영화 목록을 요청하고, 
서버에서 받은 JSON 데이터를 반환하는 비동기 함수
*/
type GetMoviesWithFetchResponse = TmdbMovieListResponse;

//비동기 함수 선언
//getMoviesWithFetch(3)을 호출하면 3페이지의 영화 목록을 요청해.
async function getMoviesWithFetch(
    page=1,
): Promise<GetMoviesWithFetchResponse> {
    const searchParams=new URLSearchParams({
        language: 'ko-KR',
        page: String(page),
    });
    
    //fetch()로 API 요청
    const response=await fetch(
        `${env.tmdbApiBaseUrl}/movie/popular?${searchParams}`,
    {
        headers:{
            Authorization: `Bearer ${env.tmdbAccessToken}`,
        }
    });

    if(!response.ok){
        throw new Error('영화 목록 요청에 실패했어요.: ${response.status}');
    }   

    return response.json();
}

export {getMoviesWithFetch, type GetMoviesWithFetchResponse};


