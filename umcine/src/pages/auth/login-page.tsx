import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

const INPUT_CLASS =
  "w-full border border-gray-200 bg-white px-3 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const canSubmit = form.email.trim().length > 0 && form.password.length > 0;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 로그인 API 연동은 8주차에서 진행
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-24">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex w-full max-w-sm flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">로그인</h1>

        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-bold">
            이메일
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            className={INPUT_CLASS}
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-bold">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호 입력"
            className={INPUT_CLASS}
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          로그인
        </button>

        <p className="text-center text-xs text-gray-500">
          아직 계정이 없나요?{" "}
          <Link to="/signup" className="font-bold text-blue-600">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
