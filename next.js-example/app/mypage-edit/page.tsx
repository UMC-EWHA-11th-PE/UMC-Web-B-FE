"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { errorMessage } from "../lib/error";
import { updateMember } from "../members/auth";
import { checkDuplicate } from "../members/signup";
import { readToken } from "../session";
import { useAuthStore } from "../store/auth-store";
import { useProfileStore } from "../store/profile-store";

export default function ProfileEditPage() {
  const token = useAuthStore((state) => state.accessToken);
  const profile = useProfileStore((state) => state.profile);
  const member = readToken(token);
  const currentNickname =
    member && profile?.email === member.email ? profile.nickname : "";

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-5 py-10">
      <h1 className="mb-6 text-2xl font-bold">내 정보 수정</h1>

      {member ? (
        <ProfileEditForm
          key={`${member.sub}:${currentNickname}`}
          email={member.email}
          currentNickname={currentNickname}
        />
      ) : (
        <Link href="/login" className="text-blue-600 underline">
          로그인하고 프로필을 수정하세요.
        </Link>
      )}
    </main>
  );
}

function ProfileEditForm({
  email,
  currentNickname,
}: {
  email: string;
  currentNickname: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setProfile = useProfileStore((state) => state.setProfile);

  const [nickname, setNickname] = useState(currentNickname);
  const [checkedNickname, setCheckedNickname] = useState("");
  const [pending, setPending] = useState<"check" | "save" | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const value = nickname.trim();
  const canCheck =
    value.length >= 2 && value.length <= 12 && value !== currentNickname;
  const canSave = canCheck && checkedNickname === value && !pending;

  async function handleDuplicateCheck() {
    if (!canCheck || pending) return;

    setPending("check");
    setCheckedNickname("");
    setStatus("");
    setError("");

    try {
      const { available } = await checkDuplicate("nickname", value);

      if (available) {
        setCheckedNickname(value);
        setStatus("사용할 수 있는 닉네임이에요.");
      } else {
        setError("이미 사용 중인 닉네임이에요.");
      }
    } catch (error) {
      setError(await errorMessage(error));
    } finally {
      setPending(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;

    setPending("save");
    setStatus("");
    setError("");

    try {
      const updated = await updateMember(value);
      queryClient.setQueryData(["members", "me"], updated);
      setProfile({ email: updated.email, nickname: updated.nickname });
      router.replace("/mypage");
    } catch (error) {
      setCheckedNickname("");
      setError(await errorMessage(error));
      setPending(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={pending !== null}>
      <fieldset disabled={pending !== null} className="grid gap-4">
        <label className="grid gap-2 text-sm font-bold">
          이메일
          <input
            type="email"
            value={email}
            readOnly
            className="rounded-lg border border-slate-300 bg-slate-100 p-3 font-normal text-slate-700"
          />
        </label>

        <div>
          <label htmlFor="profile-nickname" className="mb-2 block text-sm font-bold">
            닉네임
          </label>
          <div className="flex gap-2">
            <input
              id="profile-nickname"
              value={nickname}
              maxLength={12}
              aria-describedby="profile-nickname-help"
              onChange={(event) => {
                setNickname(event.target.value);
                setCheckedNickname("");
                setStatus("");
                setError("");
              }}
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
            />
            <button
              type="button"
              disabled={!canCheck}
              onClick={() => void handleDuplicateCheck()}
              className="shrink-0 rounded-lg border border-slate-300 px-3 text-sm font-bold disabled:opacity-50"
            >
              {pending === "check" ? "확인 중" : "중복 확인"}
            </button>
          </div>
          <p id="profile-nickname-help" className="mt-2 text-xs text-slate-500">
            닉네임은 2~12자로 입력해 주세요.
          </p>
        </div>

        {status && <p role="status" className="text-sm text-green-600">{status}</p>}
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={!canSave}
          className="rounded-lg bg-blue-600 p-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {pending === "save" ? "저장 중" : "저장"}
        </button>
      </fieldset>

      <Link href="/mypage" className="mt-4 inline-block text-sm text-blue-600 underline">
        취소
      </Link>
    </form>
  );
}