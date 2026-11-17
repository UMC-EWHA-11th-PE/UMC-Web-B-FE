import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { errorMessage as getErrorMessage } from "@/api/errors";
import { readToken } from "@/api/session";

import { login } from "@/api/members/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useProfileStore } from "@/stores/profile-store";

export function LoginPage(){
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    form.email.trim(),
  );

  const showEmailError = form.email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && form.password.length > 0;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit|| isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");



    try{
      //토큰 발급 받기
       const result = await login({
        email: form.email.trim(),
        password: form.password,
      });

      const claims = readToken(result.accessToken);
      if (!claims) throw new Error("서버에서 유효한 로그인 토큰을 받지 못했어요.");
      const member = { email: claims.email, nickname: result.nickname };
      //이전 계정의 회원 정보의 캐시 제거
      queryClient.removeQueries({ queryKey: ["members"] });
      updateProfile({
        email: member.email,
        nickname: member.nickname,
        image: ""
      })
      queryClient.setQueryData(["members", "me"], member);
      setAccessToken(result.accessToken);

      setForm((prev)=>({
        ...prev, password:""
      }));

      void navigate({ to: "/mypage" });

    }catch (error) {
      setErrorMessage(await getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }}

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
          <label
            htmlFor="login-email"
            className="mb-2 block text-xs font-bold"
          >
            이메일
          </label>

          <div className="flex items-center rounded-lg border border-slate-200 bg-white px-3 focus-within:ring-2 focus-within:ring-blue-600">
            <img
              src="/icons/mail.svg"
              alt=""
              className="size-4"
            />

            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="name@example.com"
              value={form.email}
              disabled={isSubmitting}
              onChange={(event) => {
                setForm((prev) => ({
                  ...prev,
                  email: event.target.value,
                }));
                setErrorMessage("");
              }}
              aria-invalid={showEmailError}
              aria-describedby={
                showEmailError ? "login-email-error" : undefined
              }
              className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:opacity-50"
            />
          </div>

          {showEmailError && (
            <p
              id="login-email-error"
              className="mt-2 text-xs text-red-500"
            >
              올바른 이메일을 입력해 주세요.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="login-password"
            className="mb-2 block text-xs font-bold"
          >
            비밀번호
          </label>

          <div className="flex items-center rounded-lg border border-slate-200 bg-white px-3 focus-within:ring-2 focus-within:ring-blue-600">
            <img
              src="/icons/lock.svg"
              alt=""
              className="size-4"
            />

            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호"
              value={form.password}
              disabled={isSubmitting}
              onChange={(event) => {
                setForm((prev) => ({
                  ...prev,
                  password: event.target.value,
                }));
                setErrorMessage("");
              }}
              className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 disabled:opacity-50"
            />
          </div>
        </div>

        {errorMessage && (
          <p role="alert" className="mb-3 text-xs text-red-500">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="h-11 w-full cursor-pointer rounded-md bg-blue-600 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "로그인 중" : "로그인"}
        </button>

        <p className="mt-5 text-center text-xs text-slate-500">
          처음이신가요?{" "}
          <Link
            to="/signup"
            className="font-bold text-blue-600"
          >
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
    
    
  
