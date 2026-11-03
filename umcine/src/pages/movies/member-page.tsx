import { useState } from "react";

const API_URL = "http://localhost:8080";

type CheckResponse = {
  available: boolean;
};

type RatingResponse = {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

export function MemberPage() {
  const [nickname, setNickname] = useState("noco");
  const [email, setEmail] = useState("noco@umc.com");
  const [memberId, setMemberId] = useState("1");

  const [nicknameResult, setNicknameResult] = useState<boolean | null>(null);
  const [emailResult, setEmailResult] = useState<boolean | null>(null);
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [ratings, setRatings] = useState<RatingResponse[]>([]);
  const [ratingMessage, setRatingMessage] = useState("");
  const [ratingsLoaded, setRatingsLoaded] = useState(false);

  const checkNickname = async () => {
    setNicknameResult(null);
    setNicknameError("");

    if (!nickname.trim()) {
      setNicknameError("닉네임을 입력해 주세요.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/members/nickname/${encodeURIComponent(nickname.trim())}`
      );

      if (!response.ok) throw new Error();

      const data: CheckResponse = await response.json();
      setNicknameResult(data.available);
    } catch {
      setNicknameError("닉네임을 확인하지 못했어요.");
    }
  };

  const checkEmail = async () => {
    setEmailResult(null);
    setEmailError("");

    if (!email.trim()) {
      setEmailError("이메일을 입력해 주세요.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/members/email/${encodeURIComponent(email.trim())}`
      );

      if (!response.ok) throw new Error();

      const data: CheckResponse = await response.json();
      setEmailResult(data.available);
    } catch {
      setEmailError("이메일을 확인하지 못했어요.");
    }
  };

  const getRatings = async () => {
    setRatings([]);
    setRatingMessage("");
    setRatingsLoaded(false);

    if (!/^[1-9]\d*$/.test(memberId)) {
      setRatingMessage("올바른 회원 ID를 입력해 주세요.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/members/${memberId}/ratings`
      );

      if (response.status === 404) {
        setRatingMessage("존재하지 않는 회원이에요.");
        return;
      }

      if (!response.ok) throw new Error();

      const data: RatingResponse[] = await response.json();

      setRatings(data);
      setRatingsLoaded(true);

      if (data.length === 0) {
        setRatingMessage("아직 작성한 영화 리뷰가 없어요.");
      }
    } catch {
      setRatingMessage("리뷰를 불러오지 못했어요.");
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#25252B]">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-8">

        {/* 상단 소개 */}
        <div className="mb-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#FFF0EF] px-4 py-2 text-xs font-bold tracking-[0.15em] text-[#E85B56]">
            ✦ UMCINE MEMBERS
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            My Movie <span className="text-[#E85B56]">Space.</span>
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#888892] md:text-base">
            나만의 영화 취향을 발견하는 공간.
            <br />
            회원 정보를 확인하고, 영화에 남긴 기록을 살펴보세요.
          </p>
        </div>

        {/* 회원 정보 */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-[#E85B56]" />
            <div>
              <h2 className="text-2xl font-bold">회원 정보</h2>
              <p className="mt-1 text-sm text-[#9999A2]">
                사용 가능한 닉네임과 이메일을 확인해 보세요.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* 닉네임 카드 */}
            <div className="rounded-3xl border border-[#F0EDEB] bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] text-[#E85B56]">
                    NICKNAME
                  </p>
                  <h3 className="mt-2 text-xl font-bold">
                    닉네임 중복 확인
                  </h3>
                  <p className="mt-2 text-sm text-[#9999A2]">
                    마음에 드는 닉네임을 입력해 보세요.
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0EF] text-2xl font-bold text-[#E85B56]">
                  @
                </div>
              </div>

              <div className="flex gap-3">
                <input
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setNicknameResult(null);
                    setNicknameError("");
                  }}
                  placeholder="닉네임 입력"
                  className="min-w-0 flex-1 rounded-xl border border-[#F0EDEB] bg-[#F8F8F8] px-4 py-3 text-sm text-[#25252B] outline-none transition focus:border-[#E85B56]"
                />

                <button
                  onClick={checkNickname}
                  className="shrink-0 rounded-xl bg-[#E85B56] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#D94B46]"
                >
                  확인
                </button>
              </div>

              {nicknameResult !== null && (
                <div
                  className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium ${
                    nicknameResult
                      ? "bg-[#EAF8EF] text-[#29985A]"
                      : "bg-[#FFF0EF] text-[#D94B46]"
                  }`}
                >
                  {nicknameResult
                    ? "✓ 사용 가능한 닉네임이에요!"
                    : "✕ 이미 사용 중인 닉네임이에요."}
                </div>
              )}

              {nicknameError && (
                <p className="mt-4 text-sm text-[#D94B46]">
                  {nicknameError}
                </p>
              )}
            </div>

            {/* 이메일 카드 */}
            <div className="rounded-3xl border border-[#F0EDEB] bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] text-[#E85B56]">
                    EMAIL
                  </p>
                  <h3 className="mt-2 text-xl font-bold">
                    이메일 중복 확인
                  </h3>
                  <p className="mt-2 text-sm text-[#9999A2]">
                    사용하고 싶은 이메일을 확인해 보세요.
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0EF] text-2xl text-[#E85B56]">
                  ✉
                </div>
              </div>

              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailResult(null);
                    setEmailError("");
                  }}
                  placeholder="이메일 입력"
                  className="min-w-0 flex-1 rounded-xl border border-[#F0EDEB] bg-[#F8F8F8] px-4 py-3 text-sm text-[#25252B] outline-none transition focus:border-[#E85B56]"
                />

                <button
                  onClick={checkEmail}
                  className="shrink-0 rounded-xl bg-[#E85B56] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#D94B46]"
                >
                  확인
                </button>
              </div>

              {emailResult !== null && (
                <div
                  className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium ${
                    emailResult
                      ? "bg-[#EAF8EF] text-[#29985A]"
                      : "bg-[#FFF0EF] text-[#D94B46]"
                  }`}
                >
                  {emailResult
                    ? "✓ 사용 가능한 이메일이에요!"
                    : "✕ 이미 사용 중인 이메일이에요."}
                </div>
              )}

              {emailError && (
                <p className="mt-4 text-sm text-[#D94B46]">
                  {emailError}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 영화 리뷰 */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-[#E85B56]" />
            <div>
              <h2 className="text-2xl font-bold">나의 영화 리뷰</h2>
              <p className="mt-1 text-sm text-[#9999A2]">
                영화와 함께한 순간들을 다시 꺼내 보세요.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-[#F0EDEB] bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">

            {/* 조회 영역 */}
            <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-[#F2F0EE] pb-7">
              <div className="mr-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0EF] text-xl">
                🎬
              </div>

              <div className="mr-3">
                <p className="text-sm font-bold">회원별 리뷰 조회</p>
                <p className="mt-1 text-xs text-[#9999A2]">
                  회원 ID를 입력해 주세요.
                </p>
              </div>

              <input
                type="number"
                min="1"
                value={memberId}
                onChange={(e) => {
                  setMemberId(e.target.value);
                  setRatings([]);
                  setRatingMessage("");
                  setRatingsLoaded(false);
                }}
                className="w-28 rounded-xl border border-[#F0EDEB] bg-[#F8F8F8] px-4 py-3 text-sm outline-none focus:border-[#E85B56]"
              />

              <button
                onClick={getRatings}
                className="rounded-xl bg-[#E85B56] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#D94B46]"
              >
                리뷰 조회
              </button>

              {ratingsLoaded && (
                <span className="ml-auto rounded-full bg-[#FFF0EF] px-4 py-2 text-xs font-bold text-[#E85B56]">
                  총 {ratings.length}개의 리뷰
                </span>
              )}
            </div>

            {/* 조회 결과 */}
            {ratingMessage && (
              <div className="rounded-2xl bg-[#F8F8F8] px-5 py-10 text-center text-sm text-[#888892]">
                {ratingMessage}
              </div>
            )}

            {ratings.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2">
                {ratings.map((rating) => (
                  <article
                    key={rating.ratingId}
                    className="rounded-2xl border border-[#F0EDEB] bg-[#FCFBFA] p-6 transition hover:border-[#F5B4B0] hover:shadow-md"
                  >
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div>
                        <p className="mb-2 text-xs font-bold tracking-[0.15em] text-[#E85B56]">
                          MY MOVIE REVIEW
                        </p>

                        <h3 className="text-xl font-bold">
                          영화 #{rating.movieId}
                        </h3>
                      </div>

                      <span className="shrink-0 rounded-xl bg-[#FFF5DD] px-3 py-2 text-sm font-bold text-[#E4A12C]">
                        ★ {rating.score} / 5
                      </span>
                    </div>

                    <p className="mb-6 min-h-12 text-sm leading-7 text-[#777781]">
                      {rating.comment || "아직 작성된 감상평이 없어요."}
                    </p>

                    <div className="flex items-center justify-between border-t border-[#F0EDEB] pt-4 text-xs text-[#AAAAB2]">
                      <span>
                        {new Date(rating.createdAt).toLocaleDateString("ko-KR")}
                      </span>

                      <span className="font-medium text-[#E85B56]">
                        UMCINE REVIEW
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!ratingsLoaded && !ratingMessage && (
              <div className="rounded-2xl bg-[#FCFBFA] px-5 py-12 text-center">
                <div className="mb-4 text-4xl">🍿</div>
                <p className="font-semibold text-[#55555F]">
                  어떤 영화를 감상하셨나요?
                </p>
                <p className="mt-2 text-sm text-[#AAAAB2]">
                  회원 ID를 입력하면 작성한 리뷰를 확인할 수 있어요.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}