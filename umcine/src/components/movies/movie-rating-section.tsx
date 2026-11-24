"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { useMemberRatingsQuery } from "../../hooks/use-member-ratings-query";
import { useCreateRatingMutation } from "../../hooks/use-create-rating-mutation";
import { useUpdateRatingMutation } from "../../hooks/use-update-rating-mutation";
import { useDeleteRatingMutation } from "../../hooks/use-delete-rating-mutation";

interface MovieRatingSectionProps {
  movieId: number;
}

export function MovieRatingSection({ movieId }: MovieRatingSectionProps) {
  // 로그인 여부 확인
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken;

  // 현재 로그인한 회원 정보 조회
  const memberQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: isLoggedIn,
  });

  const memberId = memberQuery.data?.memberId ?? 0;

  // 현재 회원이 작성한 평점 목록 조회
  const ratingsQuery = useMemberRatingsQuery(memberId);

  // 현재 영화에 작성한 평점 찾기
  const myRating = ratingsQuery.data?.find(
    (rating) => rating.movieId === movieId,
  );

  // 평점 입력 상태
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");

  // 평점 수정 모드 여부
  const [isEditing, setIsEditing] = useState(false);

  // 평점 등록·수정·삭제 Mutation
  const createMutation = useCreateRatingMutation();
  const updateMutation = useUpdateRatingMutation();
  const deleteMutation = useDeleteRatingMutation();

  // 서버 요청 중에는 중복 제출 방지
  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // 평점 등록
  const handleCreate = () => {
    createMutation.mutate({
      movieId,
      score,
      comment,
    });
  };

  // 수정 버튼을 누르면 기존 별점과 후기를 입력창에 표시
  const handleEdit = () => {
    if (!myRating) return;

    setScore(myRating.score);
    setComment(myRating.comment ?? "");
    setIsEditing(true);
  };

  // 수정한 평점 저장
  const handleUpdate = () => {
    if (!myRating) return;

    updateMutation.mutate(
      {
        ratingId: myRating.ratingId,
        request: {
          score,
          comment,
        },
      },
      {
        // 서버 수정 성공 시에만 수정 모드 종료
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  // 수정 취소 시 서버에 저장된 기존 평점 유지
  const handleCancel = () => {
    setIsEditing(false);
  };

  // 평점 삭제
  const handleDelete = () => {
    if (!myRating) return;

    if (!window.confirm("평점을 삭제하시겠어요?")) return;

    deleteMutation.mutate(myRating.ratingId, {
      onSuccess: () => {
        // 삭제 성공 시 입력값 초기화
        setScore(5);
        setComment("");
        setIsEditing(false);
      },
    });
  };

  // 로그인하지 않은 경우
  if (!isLoggedIn) {
    return (
      <section className="mt-8 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">내 영화 평점</h2>
        <p className="mt-3 text-gray-500">평점을 작성하려면 로그인해 주세요.</p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-lg bg-white p-6 text-left shadow-sm">
      <h2 className="text-xl font-bold">내 영화 평점</h2>

      {/* 회원 정보 또는 평점 조회 실패 */}
      {memberQuery.isError || ratingsQuery.isError ? (
        <p className="mt-3 text-red-500">평점 정보를 불러오지 못했어요.</p>
      ) : memberQuery.isPending || ratingsQuery.isPending ? (
        <p className="mt-3 text-gray-500">평점 정보를 불러오는 중이에요.</p>
      ) : (
        memberQuery.isSuccess &&
        ratingsQuery.isSuccess && (
          <div className="mt-5">
            {/* 기존 평점이 있고 수정 모드가 아닌 경우 */}
            {myRating && !isEditing ? (
              <>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="font-semibold">내가 작성한 평점</p>

                  {/* 서버에 저장된 별점만큼 노란색 별 표시 */}
                  <div className="mt-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <span
                        key={value}
                        className={`text-3xl ${
                          value <= myRating.score
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}

                    <span className="ml-2 text-sm text-gray-500">
                      {myRating.score}/5
                    </span>
                  </div>

                  <p className="mt-2 whitespace-pre-wrap text-gray-600">
                    {myRating.comment || "작성한 후기가 없어요."}
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleEdit}
                    disabled={isPending}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                  >
                    평점 수정
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="rounded-lg bg-gray-600 px-4 py-2 text-white disabled:opacity-50"
                  >
                    평점 삭제
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 별을 클릭하여 1~5점 평점 선택 */}
                <div>
                  <p className="text-sm font-medium text-gray-700">별점</p>

                  <div className="mt-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setScore(value)}
                        disabled={isPending}
                        aria-label={`${value}점`}
                        aria-pressed={score === value}
                        className={`cursor-pointer text-4xl transition-colors hover:text-yellow-400 disabled:cursor-not-allowed ${
                          value <= score ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}

                    {/* 현재 선택한 별점 표시 */}
                    <span className="ml-3 text-sm text-gray-500">
                      {score}/5
                    </span>
                  </div>
                </div>

                {/* 후기 입력 */}
                <label className="mt-4 block text-sm font-medium text-gray-700">
                  후기
                  <textarea
                    className="mt-2 block w-full rounded-lg border border-gray-300 p-3"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    disabled={isPending}
                    maxLength={500}
                    rows={3}
                    placeholder="영화에 대한 후기를 작성해 주세요."
                  />
                </label>

                <p className="mt-1 text-right text-xs text-gray-400">
                  {comment.length}/500
                </p>

                <div className="mt-4 flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={isPending}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                      >
                        {updateMutation.isPending
                          ? "저장 중..."
                          : "변경사항 저장"}
                      </button>

                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isPending}
                        className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 disabled:opacity-50"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCreate}
                      disabled={isPending}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                    >
                      {createMutation.isPending ? "등록 중..." : "평점 등록"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )
      )}
    </section>
  );
}
