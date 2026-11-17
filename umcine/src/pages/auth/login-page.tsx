
import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isPasswordValid = form.password.length > 0;

  const canSubmit = isEmailValid && isPasswordValid;

  const handleChangeField = (
    key: "email" | "password",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit) return;

    // 로그인 API는 추후 연결
    alert("로그인 API는 아직 연결되지 않았어요.");
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

            <div className="flex h-11 items-center rounded-md border border-[#E2E5EA] bg-white focus-within:border-[#4B63E6]">
              <span className="pl-3 text-[#A0A8B8]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>

              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) =>
                  handleChangeField("email", e.target.value)
                }
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#A0A8B8]"
              />
            </div>

            {form.email.length > 0 && !isEmailValid && (
              <p className="mt-1 text-xs text-red-500">
                올바른 이메일 형식을 입력해주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-semibold text-[#191B20]"
            >
              비밀번호
            </label>

            <div className="flex h-11 items-center rounded-md border border-[#E2E5EA] bg-white focus-within:border-[#4B63E6]">
              <span className="pl-3 text-[#A0A8B8]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </span>

              <input
                id="password"
                type="password"
                placeholder="비밀번호"
                value={form.password}
                onChange={(e) =>
                  handleChangeField("password", e.target.value)
                }
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#A0A8B8]"
              />
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-11 w-full rounded-md bg-[#4B63E6] text-sm font-semibold text-white transition-colors hover:bg-[#3D53D0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            로그인
          </button>
        </form>

        {/* 회원가입 링크 */}
        <p className="mt-5 text-center text-xs text-[#8D95A5]">
          처음이신가요?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#4B63E6] hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
