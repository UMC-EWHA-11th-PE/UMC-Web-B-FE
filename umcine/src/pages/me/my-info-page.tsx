import { Link } from "@tanstack/react-router";

// 더미 데이터
const MY_INFO = {
  email: "umc@example.com",
  nickname: "moviefan",
};

export function MyInfoPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-24">
      <section className="mx-auto flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-bold">내 정보</h1>

        <div>
          <p className="mb-1 text-xs font-bold">이메일</p>
          <p className="border border-gray-200 bg-white px-3 py-3 text-sm">
            {MY_INFO.email}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs font-bold">닉네임</p>
          <p className="border border-gray-200 bg-white px-3 py-3 text-sm">
            {MY_INFO.nickname}
          </p>
        </div>

        <Link
          to="/me/edit"
          className="w-full rounded-lg bg-blue-600 py-3 text-center text-sm font-semibold text-white"
        >
          수정하기
        </Link>
      </section>
    </main>
  );
}
