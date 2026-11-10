import { useAuthStore } from '@/stores/auth-store';
import { readToken } from '@/api/session';
import { useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useProfileStore } from '@/stores/profile-store';
import { updateMember } from '@/api/members/auth';
import { checkNicknameDuplicate } from '@/api/members/check-nickname-duplicate';
import { errorMessage } from '@/api/errors';
export function MyPage() {
  const token = useAuthStore(state => state.accessToken);
  const profile = useProfileStore(state => state.profile);
  const [nickname, setNickname] = useState(profile.nickname);
  const [checked, setChecked] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const value = nickname.trim();
  const valid = value.length >= 2 && value.length <= 12;
  async function check() {
    setBusy(true); setMessage('');
    try {
      const result = await checkNicknameDuplicate(value);
      setChecked(result.available ? value : '');
      setMessage(result.available ? '사용할 수 있는 닉네임이에요.' : '이미 사용 중인 닉네임이에요.');
    } catch (error) { setMessage(await errorMessage(error)); }
    finally { setBusy(false); }
  }
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !valid || checked !== value || value === profile.nickname) return;
    setBusy(true); setMessage('');
    try {
      const member = await updateMember(value);
      useProfileStore.getState().updateProfile(member);
      void navigate({ to: '/mypage' });
    } catch (error) { setMessage(await errorMessage(error)); }
    finally { setBusy(false); }
  }
  if (!readToken(token)) return <main className="p-10"><Link to="/login">로그인이 필요해요. 로그인하기</Link></main>;
  return <main className="mx-auto w-full max-w-xl flex-1 px-5 py-10">
    <h1 className="mb-6 text-2xl font-bold">내 정보 수정</h1>
    <form onSubmit={submit}>
      <fieldset disabled={busy} className="grid gap-4">
        <label className="grid gap-2">이메일<input value={profile.email} readOnly className="rounded border bg-slate-100 p-3" /></label>
        <label className="grid gap-2">닉네임<input value={nickname} maxLength={12} onChange={event => { setNickname(event.target.value); setChecked(''); setMessage(''); }} className="rounded border bg-white p-3" /></label>
        <p className="text-xs text-slate-500">닉네임은 2~12자로 입력해 주세요.</p>
        <button type="button" disabled={!valid || value === profile.nickname} onClick={() => void check()} className="rounded border p-3 disabled:opacity-40">중복 확인</button>
        <button disabled={!valid || checked !== value || value === profile.nickname} className="rounded bg-blue-600 p-3 text-white disabled:opacity-40">{busy ? '처리 중' : '저장'}</button>
      </fieldset>
      <p role="status" className="my-4 text-sm">{message}</p>
      <Link to="/mypage" className="text-blue-600">취소</Link>
    </form>
  </main>;
}
