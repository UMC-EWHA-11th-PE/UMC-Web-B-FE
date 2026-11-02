import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

// TMDB API에서 영화 상세 정보를 가져오는 함수
import { getMovieDetail } from "../../api/movies/get-movie-detail";

// TMDB 영화 상세 정보 타입
import type { TmdbMovieDetail } from "../../api/movies/models";

// TMDB 이미지 경로를 실제 URL로 변환하는 함수
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";

import { BookmarkButton } from "../../components/bookmark-button";

// 영화 상세 요청 결과를 관리하는 타입
interface MovieDetailState {
  movieId: number;
  movie: TmdbMovieDetail | null;
  errorMessage: string | null;
}

export function MovieDetailPage() {
  // URL에서 영화 ID 가져오기
  // 예: /movies/550 → movieId = "550"
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  // URL에서 가져온 문자열 ID를 숫자로 변환
  const numericMovieId = Number(movieId);

  // 기존에는 movies.find()로 직접 작성한 영화 목록에서 검색했지만,
  // 이제는 TMDB API에서 가져온 영화 상세 정보를 state로 관리
  const [movieDetail, setMovieDetail] = useState<MovieDetailState | null>(null);

  // 현재 URL의 영화 ID와 응답의 영화 ID가 일치하는 경우에만 사용
  const currentDetail =
    movieDetail?.movieId === numericMovieId ? movieDetail : null;

  // 현재 영화의 상세 정보
  const movie = currentDetail?.movie ?? null;

  // API 요청 실패 시 오류 메시지
  const errorMessage = currentDetail?.errorMessage ?? null;

  // 현재 영화 ID에 대한 응답이 없으면 로딩 중
  const isLoading = currentDetail === null;

  // URL의 movieId가 변경될 때마다 TMDB API 요청
  useEffect(() => {
    // 영화 ID가 올바르지 않으면 API 요청하지 않음
    if (!Number.isInteger(numericMovieId) || numericMovieId <= 0) {
      return;
    }

    // 이전 요청 결과가 현재 영화 정보를 덮어쓰지 않도록 방지
    let ignore = false;

    // TMDB API에서 영화 상세 정보 가져오기
    getMovieDetail(numericMovieId)
      .then((response) => {
        // 요청이 유효하다면 영화 상세 정보 저장
        if (!ignore) {
          setMovieDetail({
            movieId: numericMovieId,
            movie: response,
            errorMessage: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (!ignore) {
          setMovieDetail({
            movieId: numericMovieId,
            movie: null,
            // 워크북 6.3: 404 오류와 일반 오류 구분
            errorMessage: getMovieDetailErrorMessage(error),
          });
        }
      });

    // 컴포넌트가 사라지거나 영화 ID가 변경되면 이전 요청 무시
    return () => {
      ignore = true;
    };
  }, [numericMovieId]);

  // URL의 영화 ID가 잘못된 경우
  if (!Number.isInteger(numericMovieId) || numericMovieId <= 0) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <p className="text-lg font-semibold">올바르지 않은 영화 ID예요.</p>
      </main>
    );
  }

  // API 요청 중일 때 로딩 메시지 표시
  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <p className="text-lg font-semibold">영화 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  // API 요청에 실패한 경우
  if (errorMessage) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center">
        <p className="text-lg font-semibold">{errorMessage}</p>
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
