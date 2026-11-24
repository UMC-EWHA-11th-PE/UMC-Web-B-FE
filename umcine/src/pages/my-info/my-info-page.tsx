import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { useAuthStore } from "../../stores/auth-store";

export function MyInfoPage() {
  // Zustand에 저장된 JWT 확인
  const accessToken = useAuthStore((state) => state.accessToken);

  // 실제 서버에서 로그인한 사용자 정보 조회
  const {
    data: user,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: !!accessToken,
  });

  // 닉네임 수정 API 요청 상태 관리
  const updateMeMutation = useUpdateMeMutation();

  // 사용자가 수정한 닉네임 저장
  const [nickname, setNickname] = useState<string | null>(null);

  // 수정하지 않았다면 서버에서 조회한 기존 닉네임 표시
  const currentNickname = nickname ?? user?.nickname ?? "";

  // 닉네임이 변경되었는지 확인
  const isChanged = currentNickname.trim() !== user?.nickname;

  // 닉네임 유효성 검사
  const isValid =
    currentNickname.trim().length >= 2 && currentNickname.trim().length <= 12;

  // 수정한 닉네임 저장
  const handleSave = () => {
    if (!isChanged || !isValid) return;

    // 실제 Spring Boot 서버에 PATCH /me 요청
    updateMeMutation.mutate(
      { nickname: currentNickname.trim() },
      {
        onSuccess: () => {
          // 저장 성공 시 서버에서 갱신된 닉네임 사용
          setNickname(null);
        },
      },
    );
  };

  // 로그인하지 않은 경우
  if (!accessToken) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p>로그인이 필요한 페이지입니다.</p>
      </main>
    );
  }

  // 회원 정보 조회 중
  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p>내 정보를 불러오는 중...</p>
      </main>
    );
  }

  // 회원 정보 조회 실패
  if (isError || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p>내 정보를 불러오지 못했어요.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="mx-auto max-w-6xl px-6 py-10 text-left">
        {/* 페이지 제목 및 변경사항 저장 버튼 */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">내 정보 수정</h1>
            <p className="mt-2 text-sm text-gray-500">
              닉네임을 변경할 수 있어요.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isChanged || !isValid || updateMeMutation.isPending}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMeMutation.isPending ? "저장 중..." : "변경사항 저장"}
          </button>
        </div>

        {/* 프로필 이미지와 회원 정보 영역 */}
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* 왼쪽: 프로필 이미지 */}
          <div className="flex flex-col items-center justify-start py-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
              {/* 기본 사용자 프로필 아이콘 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-12 w-12 text-gray-700"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2z" />
              </svg>
            </div>

            <p className="mt-4 font-semibold text-gray-900">프로필 이미지</p>
            <p className="mt-1 text-xs text-gray-400">기본 프로필 이미지</p>
          </div>

          {/* 오른쪽: 회원 정보 입력 영역 */}
          <div className="space-y-6">
            {/* 닉네임 수정 */}
            <div>
              <label
                htmlFor="nickname"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                닉네임
              </label>

              <input
                id="nickname"
                type="text"
                value={currentNickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={12}
                disabled={updateMeMutation.isPending}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {/* 닉네임 유효성 검사 안내 */}
              <p
                className={`mt-2 text-xs ${
                  isValid ? "text-gray-400" : "text-red-500"
                }`}
              >
                닉네임은 2~12자로 입력해 주세요.
              </p>
            </div>

            {/* 이메일은 조회만 가능 */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                이메일
              </label>

              <input
                id="email"
                type="email"
                value={user.email}
                readOnly
                className="w-full cursor-default rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
              />

              <p className="mt-2 text-xs text-gray-400">
                이메일은 변경할 수 없어요.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
