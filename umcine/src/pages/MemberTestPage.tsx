
import { useState } from "react";
import {
  checkNickname,
  checkEmail,
  getMemberRatings,
  type RatingResponse,
} from "../api/member-api";

export default function MemberTestPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [memberId, setMemberId] = useState("1");

  const [nicknameResult, setNicknameResult] = useState("");
  const [emailResult, setEmailResult] = useState("");
  const [ratings, setRatings] = useState<RatingResponse[]>([]);
  const [ratingResult, setRatingResult] = useState("");

  const handleNicknameCheck = async () => {
    if (!nickname.trim()) return;

    try {
      const data = await checkNickname(nickname);
      setNicknameResult(
        data.available ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다."
      );
    } catch {
      setNicknameResult("닉네임 확인 중 오류가 발생했습니다.");
    }
  };

  const handleEmailCheck = async () => {
    if (!email.trim()) return;

    try {
      const data = await checkEmail(email);
      setEmailResult(
        data.available ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다."
      );
    } catch {
      setEmailResult("이메일 확인 중 오류가 발생했습니다.");
    }
  };

  const handleRatingCheck = async () => {
    const id = Number(memberId);
    if (!Number.isSafeInteger(id) || id <= 0) {
      setRatingResult("올바른 회원 ID를 입력해주세요.");
      setRatings([]);
      return;
    }

    try {
      const data = await getMemberRatings(id);
      setRatings(data);
      setRatingResult(
        data.length === 0 ? "작성한 평점이 없습니다." : ""
      );
    } catch {
      setRatings([]);
      setRatingResult("평점 조회에 실패했습니다. 회원 ID를 확인해주세요.");
    }
  };

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-8 text-white">
      <h1 className="text-3xl font-bold">회원 API 테스트</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">닉네임 중복 확인</h2>
        <input
          className="w-full rounded border p-3 text-black"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 입력"
        />
        <button
          type="button"
          className="rounded bg-blue-600 px-4 py-2"
          onClick={handleNicknameCheck}
        >
          중복 확인
        </button>
        <p>{nicknameResult}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">이메일 중복 확인</h2>
        <input
          className="w-full rounded border p-3 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 입력"
        />
        <button
          className="rounded bg-blue-600 px-4 py-2"
          onClick={handleEmailCheck}
        >
          중복 확인
        </button>
        <p>{emailResult}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">유저별 평점 조회</h2>
        <input
          className="w-full rounded border p-3 text-black"
          type="number"
          min="1"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        />
        <button
          className="rounded bg-blue-600 px-4 py-2"
          onClick={handleRatingCheck}
        >
          평점 조회
        </button>

        <p>{ratingResult}</p>

        {ratings.map((rating) => (
          <div
            key={rating.ratingId}
            className="rounded border border-gray-600 p-4"
          >
            <p>영화 ID: {rating.movieId}</p>
            <p>평점: {rating.score} / 5</p>
            <p>코멘트: {rating.comment ?? "없음"}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
