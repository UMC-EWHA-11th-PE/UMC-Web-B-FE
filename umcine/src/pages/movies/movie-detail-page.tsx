import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

// TMDB API에서 영화 상세 정보를 가져오는 함수
import { getMovieDetail } from "../../api/movies/get-movie-detail";

// TMDB 이미지 경로를 실제 URL로 변환하는 함수
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";

import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  // URL에서 영화 ID 가져오기
  // 예: /movies/550 → movieId = "550"
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  // URL에서 가져온 문자열 ID를 숫자로 변환
  const numericMovieId = Number(movieId);

  // 영화 ID가 0보다 큰 정수인지 확인
  const isValidMovieId = Number.isInteger(numericMovieId) && numericMovieId > 0;

  // TanStack Query로 영화 상세 정보 요청 및 상태 관리
  const movieDetailQuery = useQuery({
    // 영화 ID별로 상세 정보를 구분해서 캐시에 저장
    queryKey: ["movies", "detail", numericMovieId],

    // TMDB API에서 해당 영화의 상세 정보 가져오기
    queryFn: () => getMovieDetail(numericMovieId),

    // 올바른 영화 ID일 때만 API 요청
    enabled: isValidMovieId,

    // 영화 상세 정보는 30초 동안 최신 데이터로 취급(main.tsx 설정보다 우선 적용)
    staleTime: 30 * 1000,
  });

  // API 응답에서 영화 상세 정보 가져오기
  const movie = movieDetailQuery.data ?? null;

  // URL의 영화 ID가 잘못된 경우
  if (!Number.isInteger(numericMovieId) || numericMovieId <= 0) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <p className="text-lg font-semibold">올바르지 않은 영화 ID예요.</p>
      </main>
    );
  }

  // 첫 번째 영화 상세 정보 요청이 완료되기를 기다림
  if (movieDetailQuery.isPending) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <p className="text-lg font-semibold">영화 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  // API 요청에 실패한 경우
  if (movieDetailQuery.isError) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <p className="text-lg font-semibold">
          {getMovieDetailErrorMessage(movieDetailQuery.error)}
        </p>
      </main>
    );
  }

  // 영화 정보가 없는 경우
  if (!movie) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <p className="text-lg font-semibold">영화를 찾을 수 없어요.</p>
      </main>
    );
  }

  // TMDB가 반환하는 이미지 경로를 실제 URL로 변환
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  // TMDB genres는 객체 배열이므로 장르 이름만 추출
  // 예: [{ id: 28, name: "액션" }] → "액션"
  const genres = movie.genres.map((genre) => genre.name).join(" · ");

  // TMDB runtime은 분 단위이므로 시간과 분으로 변환
  // 예: 148분 → 2시간 28분
  const runtime =
    movie.runtime != null
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보 없음";

  return (
    <main className="bg-gray-50">
      {/* 영화 배경 영역 */}
      <section className="relative h-[360px] overflow-hidden">
        {/* 배경 이미지가 존재하면 표시 */}
        {backdropUrl && (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        )}

        {/* 글자가 잘 보이도록 어두운 배경 */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between px-6 py-8 text-white">
          <Link to="/" className="w-fit text-sm font-medium text-white">
            ← 영화 목록
          </Link>

          <div>
            {/* TMDB에서 받아온 영화 제목 */}
            <h1 className="text-4xl font-bold">{movie.title}</h1>

            {/* 기존 originalTitle 대신 TMDB의 original_title 사용 */}
            <p className="mt-3 text-sm text-gray-200">{movie.original_title}</p>

            {/* 개봉일 · 장르 · 상영 시간 */}
            <p className="mt-2 text-sm text-gray-200">
              {movie.release_date}
              {" · "}
              {genres}
              {" · "}
              {runtime}
            </p>
          </div>
        </div>
      </section>

      {/* 영화 상세 정보 */}
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* TMDB 영화 포스터 */}
          {posterUrl ? (
            <img
              className="w-48 shrink-0 self-start rounded-lg object-cover shadow-lg"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="flex h-72 w-48 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
              이미지 없음
            </div>
          )}

          <div className="flex-1">
            {/* TMDB 영화 태그라인 */}
            <h2 className="text-2xl font-bold text-gray-900">
              {movie.tagline || movie.title}
            </h2>

            {/* TMDB 영화 줄거리 */}
            <p className="mt-5 leading-7 text-gray-600">
              {movie.overview || "등록된 줄거리가 없어요."}
            </p>

            {/* 기존 즐겨찾기 버튼 위치에 Zustand 북마크 버튼 연결 */}
            <div className="mt-6">
              <BookmarkButton movieId={movie.id} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
