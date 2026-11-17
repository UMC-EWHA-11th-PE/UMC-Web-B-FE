
import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { BookmarkButton } from "../../components/bookmark-button";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

import {
  getMemberRatings,
  createRating,
  updateRating,
  deleteRating,
} from "../../api/ratings/rating-api";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });

  const movieId = Number(movieIdParam);
  const isValidMovieId =
    Number.isInteger(movieId) && movieId > 0;

  const queryClient = useQueryClient();
  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  // 별점 및 감상평
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");

  // 영화 상세 정보 조회
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  // 로그인한 회원 정보 조회
  const memberQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    retry: false,
  });

  const memberId = memberQuery.data?.memberId;

  // 회원 평점 목록 조회
  const ratingsQuery = useQuery({
    queryKey: ["ratings", "member", memberId],
    queryFn: () => getMemberRatings(memberId!),
    enabled:
      Boolean(accessToken) &&
      memberId != null &&
      isValidMovieId,
    retry: false,
  });

  // 현재 영화에 작성한 평점
  const myRating = ratingsQuery.data?.find(
    (rating) => rating.movieId === movieId
  );

  // 기존 평점 반영
  useEffect(() => {
    setScore(myRating?.score ?? 0);
    setComment(myRating?.comment ?? "");
  }, [
    movieId,
    myRating?.ratingId,
    myRating?.score,
    myRating?.comment,
  ]);

  // 디버깅용 로그
  useEffect(() => {
    console.log("회원 정보:", memberQuery.data);
    console.log("회원 ID:", memberId);
    console.log("회원 조회 상태:", memberQuery.status);
    console.log("평점 조회 상태:", ratingsQuery.status);
    console.log("평점 조회 오류:", ratingsQuery.error);
  }, [
    memberQuery.data,
    memberQuery.status,
    memberId,
    ratingsQuery.status,
    ratingsQuery.error,
  ]);

  // 평점 등록
  const createMutation = useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ratings", "member", memberId],
      });
      alert("평점이 등록되었어요.");
    },
    onError: (error) => {
      console.error("평점 등록 오류:", error);
      alert("평점 등록에 실패했어요.");
    },
  });

  // 평점 수정
  const updateMutation = useMutation({
    mutationFn: ({
      ratingId,
      score,
      comment,
    }: {
      ratingId: number;
      score: number;
      comment: string | null;
    }) => updateRating(ratingId, { score, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ratings", "member", memberId],
      });
      alert("평점이 수정되었어요.");
    },
    onError: (error) => {
      console.error("평점 수정 오류:", error);
      alert("평점 수정에 실패했어요.");
    },
  });

  // 평점 삭제
  const deleteMutation = useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ratings", "member", memberId],
      });
      setScore(0);
      setComment("");
      alert("평점이 삭제되었어요.");
    },
    onError: (error) => {
      console.error("평점 삭제 오류:", error);
      alert("평점 삭제에 실패했어요.");
    },
  });

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // 회원 및 평점 조회 완료 여부
  const isRatingReady =
    Boolean(accessToken) &&
    memberQuery.isSuccess &&
    memberId != null &&
    ratingsQuery.isSuccess;

  // 평점 저장
  const handleSaveRating = () => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      return;
    }

    if (!isRatingReady) {
      alert("회원 정보 또는 평점 조회가 완료되지 않았어요.");
      return;
    }

    if (score < 1 || score > 5) {
      alert("별점을 선택해 주세요.");
      return;
    }

    if (comment.length > 500) {
      alert("감상평은 500자 이하로 작성해 주세요.");
      return;
    }

    const request = {
      score,
      comment: comment.trim() || null,
    };

    if (myRating) {
      updateMutation.mutate({
        ratingId: myRating.ratingId,
        ...request,
      });
    } else {
      createMutation.mutate({
        movieId,
        ...request,
      });
    }
  };

  // 영화 ID 오류
  if (!isValidMovieId) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold">
          올바르지 않은 영화 번호예요.
        </p>
      </main>
    );
  }

  // 영화 로딩
  if (movieDetailQuery.isPending) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold">
          영화 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  // 영화 조회 오류
  if (movieDetailQuery.isError) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold">
          {getMovieDetailErrorMessage(
            movieDetailQuery.error
          )}
        </p>
      </main>
    );
  }

  const movie = movieDetailQuery.data;

  if (!movie) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold">
          영화를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  const genres = movie.genres
    .map((genre) => genre.name)
    .join(", ");

  const runtime =
    movie.runtime != null
      ? `${Math.floor(movie.runtime / 60)}시간 ${
          movie.runtime % 60
        }분`
      : "상영 시간 정보가 없어요.";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 배경 이미지 */}
      <section className="relative h-[360px] overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 mx-auto max-w-6xl px-8 pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white"
          >
            <span aria-hidden="true">‹</span>
            영화 목록
          </Link>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-6xl px-8 pb-6 text-white">
            <h1 className="text-4xl font-bold">
              {movie.title}
            </h1>

            <p className="mt-2 text-sm">
              {movie.original_title}
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <span>
                {movie.release_date?.replaceAll("-", ".")}
              </span>
              <span>{genres}</span>
              <span>{runtime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 영화 상세 정보 */}
      <section className="mx-auto grid max-w-6xl grid-cols-[180px_1fr_300px] gap-8 px-8 py-6">
        {/* 포스터 */}
        <div>
          {posterUrl && (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="w-full rounded-lg object-cover shadow-md"
            />
          )}
        </div>

        {/* 영화 설명 */}
        <div>
          <h2 className="text-lg font-bold">
            {movie.tagline}
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-500">
            {movie.overview}
          </p>

          <BookmarkButton movieId={movie.id} />
        </div>

        {/* 내 평점 */}
        <aside className="border-l border-gray-200 pl-8">
          <h2 className="text-lg font-bold">
            내 평점
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            별점은 필수, 후기는 선택이에요.
          </p>

          {/* 별점 선택 */}
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value}점`}
                aria-pressed={score === value}
                onClick={() => setScore(value)}
                disabled={isSaving}
                className={`flex h-9 w-9 items-center justify-center rounded-md border bg-white text-xl ${
                  value <= score
                    ? "border-yellow-400 text-yellow-500"
                    : "border-gray-200 text-gray-400"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {/* 감상평 */}
          <textarea
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            maxLength={500}
            disabled={isSaving}
            className="mt-3 h-24 w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-sm outline-none"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
          />

          <p className="mt-1 text-right text-xs text-gray-400">
            {comment.length}/500
          </p>

          {/* 평점 조회 상태 표시 */}
          {accessToken && memberQuery.isPending && (
            <p className="mt-2 text-xs text-gray-500">
              회원 정보를 불러오는 중이에요.
            </p>
          )}

          {accessToken && memberQuery.isError && (
            <p className="mt-2 text-xs text-red-500">
              회원 정보 조회에 실패했어요.
            </p>
          )}

          {accessToken &&
            memberQuery.isSuccess &&
            memberId == null && (
              <p className="mt-2 text-xs text-red-500">
                회원 ID를 확인할 수 없어요.
              </p>
            )}

          {accessToken && ratingsQuery.isFetching && (
            <p className="mt-2 text-xs text-gray-500">
              평점 정보를 불러오는 중이에요.
            </p>
          )}

          {accessToken && ratingsQuery.isError && (
            <p className="mt-2 text-xs text-red-500">
              평점 조회에 실패했어요.
            </p>
          )}

          {!accessToken && (
            <p className="mt-2 text-xs text-gray-500">
              평점을 저장하려면 로그인이 필요해요.
            </p>
          )}

          {/* 저장 버튼 */}
          <button
            type="button"
            onClick={handleSaveRating}
            disabled={isSaving}
            className="mt-2 w-full rounded-md bg-gray-900 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSaving
              ? "처리 중..."
              : myRating
                ? "평점 수정"
                : "평점 저장"}
          </button>

          {/* 삭제 버튼 */}
          {myRating && (
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm("평점을 삭제할까요?")
                ) {
                  deleteMutation.mutate(
                    myRating.ratingId
                  );
                }
              }}
              disabled={isSaving || !isRatingReady}
              className="mt-2 w-full rounded-md border border-gray-300 py-3 text-sm font-semibold text-gray-600 disabled:opacity-50"
            >
              평점 삭제
            </button>
          )}
        </aside>
      </section>
    </main>
  );
}
