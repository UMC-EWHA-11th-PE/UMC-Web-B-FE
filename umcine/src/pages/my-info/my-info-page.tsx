import { useState } from "react";

// 화면에 표시할 사용자 정보 (실제 API 대신 임시 데이터 사용)
const DEFAULT_USER = {
  email: "test@example.com",
  nickname: "젼졔",
};

export function MyInfoPage() {
  // 저장된 사용자 정보
  const [user, setUser] = useState(DEFAULT_USER);

  // 수정 중인 입력값
  const [nickname, setNickname] = useState(user.nickname);

  // 수정 모드 여부
  const [isEditing, setIsEditing] = useState(false);

  // 수정 버튼을 누르면 입력창 표시
  const handleEdit = () => {
    setNickname(user.nickname);
    setIsEditing(true);
  };

  // 수정한 닉네임 저장
  const handleSave = () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해 주세요.");
      return;
    }

    // 기존 사용자 정보 중 닉네임만 변경
    setUser((prev) => ({
      ...prev,
      nickname: nickname.trim(),
    }));

    setIsEditing(false);
    alert("내 정보가 수정되었습니다!");
  };

  // 수정 취소 시 기존 정보 유지
  const handleCancel = () => {
    setNickname(user.nickname);
    setIsEditing(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-8 text-center text-2xl font-bold">내 정보</h1>

        {/* 이메일은 조회만 가능 */}
        <div>
          <label className="mb-2 block font-medium">이메일</label>
          <p className="rounded-lg border bg-gray-100 p-3">{user.email}</p>
        </div>

        {/* 수정 모드에 따라 닉네임 표시 또는 입력 */}
        <div>
          <label htmlFor="nickname" className="mb-2 block font-medium">
            닉네임
          </label>

          {isEditing ? (
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          ) : (
            <p className="rounded-lg border bg-gray-100 p-3">{user.nickname}</p>
          )}
        </div>

        {/* 조회 모드와 수정 모드의 버튼 구분 */}
        {isEditing ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-lg bg-gray-300 p-3 font-semibold"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-lg bg-blue-600 p-3 font-semibold text-white"
            >
              저장
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleEdit}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white"
          >
            내 정보 수정
          </button>
        )}
      </section>
    </main>
  );
}
