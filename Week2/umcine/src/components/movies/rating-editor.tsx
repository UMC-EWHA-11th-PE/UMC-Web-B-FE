import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createRating,
  deleteRating,
  getRatings,
  updateRating,
  type Rating,
} from '@/api/ratings/ratings';
import { errorMessage } from '@/api/errors';
import { readToken } from '@/api/session';
import { useAuthStore } from '@/stores/auth-store';

const STARS = [1, 2, 3, 4, 5];

interface RatingFormProps {
  movieId: number;
  memberId: string;
  existing?: Rating;
}

type RatingAction =
  | { type: 'save'; score: number; comment: string }
  | { type: 'delete'; ratingId: number };

function RatingForm({ movieId, memberId, existing }: RatingFormProps) {
  const [score, setScore] = useState(existing?.score ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? '');
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const ratingMutation = useMutation({
    mutationFn: async (action: RatingAction) => {
      if (action.type === 'delete') {
        await deleteRating(action.ratingId);
        return;
      }

      const body = { score: action.score, comment: action.comment };

      if (existing) {
        await updateRating(existing.ratingId, body);
        return;
      }

      await createRating({ movieId, ...body });
    },
    onMutate: () => {
      setMessage('');
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['ratings', memberId],
      }),
    onError: async (error) => {
      setMessage(await errorMessage(error));
    },
  });

  const isPending = ratingMutation.isPending;
  const canSave = !isPending && score >= 1 && score <= 5 && comment.length <= 500;

  const handleSave = () => {
    if (!canSave) return;

    ratingMutation.mutate({ type: 'save', score, comment });
  };

  const handleDelete = () => {
    if (isPending || !existing) return;

    ratingMutation.mutate({
      type: 'delete',
      ratingId: existing.ratingId,
    });
  };

  return (
    <div>
      <fieldset disabled={isPending} aria-busy={isPending}>
        <div role="group" aria-label="평점 선택" className="my-3 flex gap-2">
          {STARS.map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`${star}점`}
              aria-pressed={score === star}
              onClick={() => setScore(star)}
              className={`text-3xl ${
                star <= score ? 'text-amber-500' : 'text-slate-300'
              }`}
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
          className="h-28 w-full rounded border bg-white p-3 text-sm"
        />

        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className="mt-3 w-full rounded bg-blue-600 p-3 text-white disabled:opacity-40"
        >
          {isPending ? '처리 중' : existing ? '평점 수정' : '평점 저장'}
        </button>

        {existing && (
          <button
            type="button"
            onClick={handleDelete}
            className="mt-2 w-full rounded border p-3 text-red-600"
          >
            평점 삭제
          </button>
        )}
      </fieldset>

      {message && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {message}
        </p>
      )}
    </div>
  );
}

export function RatingEditor({ movieId }: { movieId: number }) {
  const token = useAuthStore((state) => state.accessToken);
  const memberId = readToken(token)?.sub ?? '';

  const ratingsQuery = useQuery({
    queryKey: ['ratings', memberId],
    queryFn: () => getRatings(memberId),
    enabled: Boolean(memberId),
    retry: false,
  });

  if (!memberId) {
    return (
      <p className="mt-4 text-sm">
        <Link to="/login" className="text-blue-600">
          로그인
        </Link>
        후 평점을 남길 수 있어요.
      </p>
    );
  }

  if (ratingsQuery.isPending) {
    return <p role="status">내 평점을 불러오는 중이에요.</p>;
  }

  if (ratingsQuery.isError) {
    return (
      <div>
        <p role="alert">내 평점을 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => void ratingsQuery.refetch()}
          className="mt-3 text-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const existing = ratingsQuery.data.find((rating) => rating.movieId === movieId);

  return (
    <RatingForm
      key={`${memberId}:${movieId}:${existing?.ratingId ?? 'new'}:${existing?.updatedAt ?? ''}`}
      movieId={movieId}
      memberId={memberId}
      existing={existing}
    />
  );
}