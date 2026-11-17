import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { readToken } from '@/api/session';
import { getRatings, saveRating, deleteRating, type Rating } from '@/api/ratings';
import { errorMessage } from '@/api/errors';

function RatingForm({ movieId, existing, memberId }: { movieId: number; existing?: Rating; memberId: string }) {
  const [score, setScore] = useState(existing?.score ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const client = useQueryClient();
  async function submit(remove = false) {
    if (busy) return;
    setBusy(true); setMessage('');
    try {
      if (remove && existing) await deleteRating(existing.ratingId);
      else await saveRating(movieId, score, comment, existing?.ratingId);
      await client.invalidateQueries({ queryKey: ['ratings', memberId] });
      setMessage(remove ? '평점을 삭제했어요.' : '평점을 저장했어요.');
    } catch (error) {
      setMessage(await errorMessage(error));
      // A duplicate can be created in another tab; refresh the existing rating.
      void client.invalidateQueries({ queryKey: ['ratings', memberId] });
    } finally { setBusy(false); }
  }
  return <div>
    <fieldset disabled={busy}>
      <div role="group" aria-label="평점 선택" className="my-3 flex gap-2">
        {[1,2,3,4,5].map(star => <button key={star} type="button" aria-label={`${star}점`} aria-pressed={score === star} onClick={() => setScore(star)} className={`text-3xl ${star <= score ? 'text-amber-500' : 'text-slate-300'}`}>★</button>)}
      </div>
      <textarea aria-label="영화 후기" placeholder="후기는 선택이에요. (500자 이하)" maxLength={500} value={comment} onChange={event => setComment(event.target.value)} className="h-28 w-full rounded border bg-white p-3 text-sm" />
      <button type="button" disabled={score === 0} onClick={() => void submit()} className="mt-3 w-full rounded bg-blue-600 p-3 text-white disabled:opacity-40">{busy ? '처리 중' : existing ? '평점 수정' : '평점 저장'}</button>
      {existing && <button type="button" onClick={() => void submit(true)} className="mt-2 w-full rounded border p-3 text-red-600">평점 삭제</button>}
    </fieldset>
    <p role="status" className="mt-3 text-sm">{message}</p>
  </div>;
}

export function RatingEditor({ movieId }: { movieId: number }) {
  const token = useAuthStore(state => state.accessToken);
  const claims = readToken(token);
  const memberId = claims?.sub ?? '';
  const query = useQuery({ queryKey: ['ratings', memberId], queryFn: () => getRatings(memberId), enabled: !!claims, retry: false });
  if (!claims) return <p className="mt-4 text-sm"><Link to="/login" className="text-blue-600">로그인</Link> 후 평점을 남길 수 있어요.</p>;
  if (query.isPending) return <p role="status">내 평점을 불러오는 중이에요.</p>;
  if (query.isError) return <div><p role="alert">내 평점을 불러오지 못했어요.</p><button onClick={() => void query.refetch()} className="mt-3 text-blue-600">다시 시도</button></div>;
  const existing = query.data.find(rating => rating.movieId === movieId);
  return <RatingForm key={`${memberId}:${movieId}:${existing?.ratingId ?? 'new'}:${existing?.updatedAt ?? ''}`} memberId={memberId} movieId={movieId} existing={existing} />;
}
