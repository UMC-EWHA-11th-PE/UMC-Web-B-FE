
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { UserRound, ChevronLeft } from "lucide-react";

const DEFAULT_USER = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
};

export function MyPageEdit() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(
    () => localStorage.getItem("umcine-nickname") ?? DEFAULT_USER.nickname
  );

  const [email] = useState(DEFAULT_USER.email);

  const [checkedNickname, setCheckedNickname] = useState("");

  const handleCheckNickname = () => {
    if (nickname.trim().length < 2) {
      alert("닉네임은 2자 이상 입력해 주세요.");
      return;
    }

    setCheckedNickname(nickname.trim());
    alert("사용 가능한 닉네임입니다. (임시 확인)");
  };

  const handleSave = () => {
    const nextNickname = nickname.trim();

    if (nextNickname.length < 2) {
      alert("닉네임은 2자 이상 입력해 주세요.");
      return;
    }

    if (nextNickname !== checkedNickname) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }

    localStorage.setItem("umcine-nickname", nextNickname);
    alert("정보가 수정되었습니다.");
    navigate({ to: "/mypage" });
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex items-center gap-3 border-b border-[#E2E5EA] pb-5">
          <Link to="/mypage" aria-label="내 정보로 돌아가기">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-[28px] font-bold text-[#191B20]">
            내 정보 수정
          </h1>
        </div>

        <section className="max-w-[520px] py-8">
          <h2 className="mb-6 text-base font-bold">기본 정보</h2>

          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#E4E6EB]">
            <UserRound size={44} className="text-[#191B20]" />
          </div>

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
                onChange={(e) => {
                  setNickname(e.target.value);
                  setCheckedNickname("");
                }}
                className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#4B63E6]"
                placeholder="닉네임을 입력하세요"
              />

              <button
                type="button"
                onClick={handleCheckNickname}
                className="shrink-0 rounded-md border border-[#4B63E6] px-4 text-sm font-semibold text-[#4B63E6]"
              >
                중복 확인
              </button>
            </div>
          </div>

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

          <button
            type="button"
            onClick={handleSave}
            className="w-full rounded-md bg-[#4B63E6] py-3 text-sm font-semibold text-white hover:bg-[#3D53D0]"
          >
            변경사항 저장
          </button>

          <div className="mt-12 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => alert("회원 탈퇴 기능은 추후 연결할 예정입니다.")}
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
