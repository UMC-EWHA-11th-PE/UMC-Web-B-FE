"use client";

import { useState } from "react";
import { useLoginMutation } from "../../hooks/use-login-mutation";

// 이메일 형식 검사 (예: example@email.com)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 로그인 폼의 초기 입력값
const DEFAULT_FORM = {
  email: "",
  password: "",
};

export function LoginPage() {
  // 이메일과 비밀번호 입력값 관리
  const [form, setForm] = useState(DEFAULT_FORM);

  // 로그인 API 요청 상태 관리 (8주차 추가)
  const loginMutation = useLoginMutation();

  // 입력값이 변경되면 해당 필드만 업데이트
  const handleChangeField = (key: keyof typeof DEFAULT_FORM, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 이메일 형식이 올바르고 비밀번호를 입력해야 로그인 가능
  const canSubmit =
    EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  // 로그인 버튼 클릭 시 실제 로그인 API 호출
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    // 입력한 이메일과 비밀번호로 POST /auth/login 요청
    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-md"
      >
        <h1 className="mb-8 text-center text-2xl font-bold">로그인</h1>

        {/* 이메일 입력 */}
        <div>
          <label htmlFor="email" className="mb-2 block font-medium">
            이메일
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={(e) => handleChangeField("email", e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label htmlFor="password" className="mb-2 block font-medium">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        {/* 입력값이 없거나 로그인 요청 중이면 버튼 비활성화 */}
        <button
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {loginMutation.isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </main>
  );
}
