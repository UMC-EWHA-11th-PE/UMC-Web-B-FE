import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

const INPUT_CLASS =
  "w-full border border-gray-200 bg-white px-3 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600 disabled:bg-gray-100 disabled:text-gray-500";

// 더미 데이터
const MY_INFO = {
  email: "umc@example.com",
  nickname: "moviefan",
};

export function MyInfoEditPage() {
  const [nickname, setNickname] = useState(MY_INFO.nickname);

  const trimmed = nickname.trim();
  const isNicknameValid = trimmed.length >= 2 && trimmed.length <= 12;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 정보 수정 API 연동은 8주차에서 진행
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-24">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex w-full max-w-sm flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">내 정보 수정</h1>

        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-bold">
            이메일
          </label>
          <input
            id="email"
            type="email"
            className={INPUT_CLASS}
            value={MY_INFO.email}
            disabled
          />
        </div>

        <div>
          <label htmlFor="nickname" className="mb-1 block text-xs font-bold">
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            placeholder="2~12자"
            className={INPUT_CLASS}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            aria-invalid={showNicknameError}
          />
          {showNicknameError && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              닉네임은 2자 이상 12자 이하로 입력해 주세요.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isNicknameValid}
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          저장하기
        </button>

        <Link to="/me" className="text-center text-xs font-bold text-gray-500">
          취소
        </Link>
      </form>
    </main>
  );
}
