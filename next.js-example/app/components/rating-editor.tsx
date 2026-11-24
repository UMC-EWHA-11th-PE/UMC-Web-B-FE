"use client";
import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { errorMessage } from "../lib/error";
import {
  deleteRating,
  getRatings,
  saveRating,
  type Rating,
} from "../lib/rating";
import { readToken } from "../session";
import { useAuthStore } from "../store/auth-store";

export function RatingEditor({ movieId }: { movieId: number }) {
  const token = useAuthStore((state) => state.accessToken);
  const memberId = readToken(token)?.sub;

  if (!memberId) {
    return (
      <p className="text-sm">
        <Link href="/login" className="font-bold text-blue-600 underline">
          로그인
        </Link>
        {" 후 평점을 남길 수 있어요."}
      </p>
    );
  }

  return (
    <MemberRating
      key={`${memberId}:${movieId}`}
      memberId={memberId}
      movieId={movieId}
    />
  );
}

function MemberRating({
  memberId,
  movieId,
}: {
  memberId: string;
  movieId: number;
}) {
  const [message, setMessage] = useState("");
  const query = useQuery({
    queryKey: ["ratings", memberId],
    queryFn: () => getRatings(memberId),
    retry: false,
  });

  if (query.isPending) {
    return <p role="status">내 평점을 불러오는 중이에요.</p>;
  }

  if (query.isError && !query.data) {
    return (
      <div>
        <p role="alert">내 평점을 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => void query.refetch()}
          className="mt-2 text-blue-600 underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const existing = query.data?.find((rating) => rating.movieId === movieId);

  return (
    <>
      <RatingForm
        key={`${existing?.ratingId ?? "new"}:${existing?.updatedAt ?? ""}`}
        memberId={memberId}
        movieId={movieId}
        existing={existing}
        setMessage={setMessage}
      />
      <p role="status" className="mt-3 text-sm">
        {message}
      </p>
    </>
  );
}

function RatingForm({
  memberId,
  movieId,
  existing,
  setMessage,
}: {
  memberId: string;
  movieId: number;
  existing?: Rating;
  setMessage: (message: string) => void;
}) {
  const [score, setScore] = useState(existing?.score ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();
  const queryKey = ["ratings", memberId];

  async function submit(action: "save" | "delete") {
    if (busy || (action === "save" && (score < 1 || score > 5))) return;

    setBusy(true);
    setMessage("");

    try {
      if (action === "delete") {
        if (!existing) return;

        await deleteRating(existing.ratingId);
        await queryClient.cancelQueries({ queryKey });
        queryClient.setQueryData<Rating[]>(queryKey, (ratings) =>
          ratings?.filter((rating) => rating.ratingId !== existing.ratingId),
        );
        setMessage("평점을 삭제했어요.");
      } else {
        const saved = await saveRating(movieId, score, comment, existing?.ratingId);
        await queryClient.cancelQueries({ queryKey });
        queryClient.setQueryData<Rating[]>(queryKey, (ratings = []) => [
          ...ratings.filter((rating) => rating.movieId !== movieId),
          saved,
        ]);
        setMessage("평점을 저장했어요.");
      }
    } catch (error) {
      setMessage(await errorMessage(error));
      void queryClient.invalidateQueries({ queryKey });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit("save");
      }}
      aria-busy={busy}
    >
      <fieldset disabled={busy}>
        <div role="group" aria-label="평점 선택" className="mb-3 flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`${star}점`}
              aria-pressed={score === star}
              onClick={() => setScore(star)}
              className={`text-3xl ${star <= score ? "text-amber-500" : "text-slate-300"}`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          aria-label="영화 후기"
          placeholder="후기는 선택이에요. (500자 이하)"
          maxLength={500}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="h-28 w-full rounded border border-slate-300 bg-white p-3 text-sm text-slate-900"
        />

        <div className="mt-3 flex gap-2">
          <button
            type="submit"
            disabled={score === 0}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {busy ? "처리 중" : existing ? "평점 수정" : "평점 저장"}
          </button>

          {existing && (
            <button
              type="button"
              onClick={() => void submit("delete")}
              className="rounded border px-4 py-2 text-sm text-red-600"
            >
              평점 삭제
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}
