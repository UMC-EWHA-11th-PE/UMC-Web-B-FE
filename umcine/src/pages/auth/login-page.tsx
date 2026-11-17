
import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

export function LoginPage() {
  // 로그인 입력값 관리
  const [form, setForm] = useState(DEFAULT_FORM);

  // 로그인 API 요청 상태 관리
  const loginMutation = useLoginMutation();

  // 이메일 형식과 비밀번호 입력 여부 확인
  const canSubmit =
    EMAIL_REGEX.test(form.email.trim()) &&
    form.password.length > 0;

  // 입력값 변경
  const handleChangeField = (
    key: keyof typeof DEFAULT_FORM,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 로그인 API 요청
  const handleSubmit = (
    event: SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#F7F8FA] px-4 py-12">
      <div className="w-full max-w-[376px]">
        <h1 className="mb-5 text-[28px] font-bold text-[#191B20]">
          로그인
        </h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >
          {/* 이메일 */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-semibold text-[#191B20]"
            >
              이메일
            </label>

            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              disabled={loginMutation.isPending}
              onChange={(e) =>
                handleChangeField("email", e.target.value)
              }
              className="h-11 w-full rounded-md border border-[#E2E5EA] bg-white px-3 text-sm outline-none placeholder:text-[#A0A8B8] focus:border-[#4B63E6] disabled:bg-gray-50"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-semibold text-[#191B20]"
            >
              비밀번호
            </label>

            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={form.password}
              disabled={loginMutation.isPending}
              onChange={(e) =>
                handleChangeField("password", e.target.value)
              }
              className="h-11 w-full rounded-md border border-[#E2E5EA] bg-white px-3 text-sm outline-none placeholder:text-[#A0A8B8] focus:border-[#4B63E6] disabled:bg-gray-50"
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
            className="mt-2 h-11 w-full rounded-md bg-[#4B63E6] text-sm font-semibold text-white transition-colors hover:bg-[#3D53D0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>

        {/* 회원가입 이동 */}
        <p className="mt-4 text-center text-xs text-[#8D95A5]">
          아직 계정이 없나요?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#4B63E6] no-underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
