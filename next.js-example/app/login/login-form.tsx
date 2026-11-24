"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { errorMessage as getErrorMessage } from "../lib/error";
import { login } from "../members/auth";
import { readToken } from "../session";
import { useAuthStore } from "../store/auth-store";
import { useProfileStore } from "../store/profile-store";

const inputClassName =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 disabled:opacity-50";

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const showEmailError = email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && password.length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { accessToken, nickname } = await login({
        email: email.trim(),
        password,
      });

      const claims = readToken(accessToken);
      if (!claims) {
        throw new Error("서버에서 유효한 로그인 토큰을 받지 못했어요.");
      }

      const member = { email: claims.email, nickname };

      queryClient.removeQueries({ queryKey: ["members"] });
      queryClient.setQueryData(["members", "me"], member);
      useProfileStore.getState().setProfile(member);
      setAccessToken(accessToken);

      setPassword("");
      router.push("/mypage");

    } catch (error) {
      setErrorMessage(await getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-20">
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isSubmitting}
        className="w-full max-w-[400px]"
      >
        <h1 className="mb-5 text-[30px] font-extrabold">로그인</h1>

        <div className="mb-4">
          <label htmlFor="login-email" className="mb-2 block text-xs font-bold">
            이메일
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="name@example.com"
            value={email}
            disabled={isSubmitting}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrorMessage("");
            }}
            aria-invalid={showEmailError}
            aria-describedby={showEmailError ? "login-email-error" : undefined}
            className={inputClassName}
          />
          {showEmailError && (
            <p id="login-email-error" className="mt-2 text-xs text-red-500">
              올바른 이메일을 입력해 주세요.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="login-password" className="mb-2 block text-xs font-bold">
            비밀번호
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호"
            value={password}
            disabled={isSubmitting}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrorMessage("");
            }}
            className={inputClassName}
          />
        </div>

        {errorMessage && (
          <p role="alert" className="mb-3 text-xs text-red-500">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="h-11 w-full rounded-md bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "로그인 중" : "로그인"}
        </button>

        <p className="mt-5 text-center text-xs text-slate-500">
          처음이신가요?{" "}
          <Link href="/signup" className="font-bold text-blue-600">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}