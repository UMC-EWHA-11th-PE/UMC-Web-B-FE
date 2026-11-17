
import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { UserRound, ChevronLeft } from "lucide-react";

import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

export function MyPageEdit() {
  const navigate = useNavigate();

  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  // 로그인한 사용자 정보 조회
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 닉네임 입력값 관리
  const [nicknameInput, setNicknameInput] = useState("");

  // 닉네임 중복 확인 상태
  const [checkedNickname, setCheckedNickname] = useState("");

  // 내 정보 수정 Mutation
  const updateMeMutation = useUpdateMeMutation();

  // 서버에서 받은 기존 정보
  const currentNickname = meQuery.data?.nickname ?? "";
  const email = meQuery.data?.email ?? "";

  // 입력값이 없으면 기존 닉네임 표시
  const nickname =
    nicknameInput === "" ? currentNickname : nicknameInput;

  const trimmedNickname = nickname.trim();

  // 닉네임 유효성 검사
  const isNicknameValid =
    trimmedNickname.length >= 2 &&
    trimmedNickname.length <= 12;

  const isUnchanged =
    trimmedNickname === currentNickname;

  const canSubmit =
    isNicknameValid &&
    (isUnchanged || checkedNickname === trimmedNickname);

  // 닉네임 중복 확인
  const handleCheckNickname = () => {
    if (!isNicknameValid) {
      alert("닉네임은 2~12자로 입력해 주세요.");
      return;
    }

    // 실제 중복 확인 API 연결 전 임시 처리
    setCheckedNickname(trimmedNickname);
    alert("사용 가능한 닉네임입니다. (임시 확인)");
  };

  // 내 정보 수정 요청
  const handleSubmit = (
    event: SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!canSubmit || updateMeMutation.isPending) {
      return;
    }

    if (isUnchanged) {
      navigate({ to: "/mypage" });
      return;
    }

    updateMeMutation.mutate(
      { nickname: trimmedNickname },
      {
        onSuccess: () => {
          navigate({ to: "/mypage" });
        },
      }
    );
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex items-center gap-3 border-b border-[#E2E5EA] pb-5">
          <Link
            to="/mypage"
            aria-label="내 정보로 돌아가기"
          >
            <ChevronLeft size={24} />
          </Link>

          <h1 className="text-[28px] font-bold text-[#191B20]">
            내 정보 수정
          </h1>
        </div>

        <section className="max-w-[520px] py-8">
          <h2 className="mb-6 text-base font-bold">
            기본 정보
          </h2>

          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#E4E6EB]">
            <UserRound
              size={44}
              className="text-[#191B20]"
            />
          </div>

          <form onSubmit={handleSubmit}>
            {/* 닉네임 */}
            <div className="mb-6">
              <label
                htmlFor="nickname"
                className="mb-2 block text-sm font-semibold"
              >
                닉네임
              </label>

              <div className="flex gap-2">
                <input
                  id="nickname"
                  value={nickname}
                  disabled={
                    meQuery.isPending ||
                    updateMeMutation.isPending
                  }
                  onChange={(e) => {
                    setNicknameInput(e.target.value);
                    setCheckedNickname("");
                  }}
                  className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#4B63E6]"
                  placeholder="닉네임을 입력하세요"
                />

                <button
                  type="button"
                  onClick={handleCheckNickname}
                  disabled={
                    !isNicknameValid ||
                    meQuery.isPending ||
                    updateMeMutation.isPending
                  }
                  className="shrink-0 rounded-md border border-[#4B63E6] px-4 text-sm font-semibold text-[#4B63E6] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  중복 확인
                </button>
              </div>
            </div>

            {/* 이메일 */}
            <div className="mb-10">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                이메일
              </label>

              <input
                id="email"
                value={email}
                readOnly
                className="w-full rounded-md border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
              />

              <p className="mt-2 text-xs text-gray-400">
                이메일은 변경할 수 없습니다.
              </p>
            </div>

            {/* 저장 버튼 */}
            <button
              type="submit"
              disabled={
                !canSubmit ||
                meQuery.isPending ||
                updateMeMutation.isPending
              }
              className="w-full rounded-md bg-[#4B63E6] py-3 text-sm font-semibold text-white hover:bg-[#3D53D0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateMeMutation.isPending
                ? "저장 중"
                : "변경사항 저장"}
            </button>
          </form>

          {/* 회원 탈퇴 */}
          <div className="mt-12 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() =>
                alert(
                  "회원 탈퇴 기능은 추후 연결할 예정입니다."
                )
              }
              className="text-sm text-gray-400 underline"
            >
              회원 탈퇴
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
