import { useState } from "react";

// 로그인 폼의 초기 입력값
const DEFAULT_FORM = {
  email: "",
  password: "",
};

export function LoginPage() {
  // 이메일과 비밀번호 입력값 관리
  const [form, setForm] = useState(DEFAULT_FORM);

  // 입력값이 변경되면 해당 필드만 업데이트
  const handleChangeField = (key: keyof typeof DEFAULT_FORM, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 이메일과 비밀번호를 모두 입력해야 로그인 가능
  const canSubmit = form.email.trim().length > 0 && form.password.length > 0;

  // 로그인 버튼 클릭 시 입력값 확인
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit) return;

    // 이번 미션에서는 실제 로그인 API를 호출하지 않음
    alert("로그인 성공!");
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

        {/* 두 입력값이 모두 있어야 로그인 버튼 활성화 */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          로그인
        </button>
      </form>
    </main>
  );
}
