import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { useBookmarkStore } from "../utils/bookmark-storage";
import { useUpdateMeMutation } from "../hooks/use-update-me-mutation";
import { checkNicknameDuplicate } from "../api/members/check-nickname-duplicate";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

function MyPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("gs0428");

  const [originalNickname, setOriginalNickname] = useState("gs0428");

  const [isNicknameAvailable, setIsNicknameAvailable] =
    useState<boolean | null>(null);

  const [checkedNickname, setCheckedNickname] = useState("");

  const [email] = useState("gwangsoo@cinemalab.kr");

  const updateMeMutation = useUpdateMeMutation();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  // Zustand에 저장된 실제 북마크 영화 ID
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds
  );

  const moviesPerPage = 3;
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const currentMovies = movies.slice(
    (page - 1) * moviesPerPage,
    page * moviesPerPage
  );

  // 북마크한 영화의 실제 TMDB 정보 조회
  useEffect(() => {
    let cancelled = false;

    const fetchBookmarkedMovies = async () => {
      if (bookmarkedMovieIds.length === 0) {
        setMovies([]);
        setIsLoading(false);
        setError("");
        return;
      }

      if (!TMDB_API_KEY) {
        setError("TMDB API 키가 설정되지 않았습니다.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const results = await Promise.all(
          bookmarkedMovieIds.map(async (movieId) => {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
              {
                headers: {
                  Authorization: `Bearer ${TMDB_API_KEY}`,
                  accept: "application/json",
                },
              }
            );

            if (!response.ok) {
              const errorText = await response.text();

              console.error(
                "TMDB 오류:",
                response.status,
                errorText
              );

              throw new Error(
                `TMDB 요청 실패: ${response.status}`
              );
            }

            return (await response.json()) as Movie;
          })
        );

        if (!cancelled) {
          setMovies(results);
          setPage(1);
        }
      } catch (error) {
        console.error("즐겨찾기 조회 오류:", error);

        if (!cancelled) {
          setError("즐겨찾기 영화 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchBookmarkedMovies();

    return () => {
      cancelled = true;
    };
  }, [bookmarkedMovieIds]);

  // 닉네임 저장
  const trimmedNickname = nickname.trim();

  const canSubmit =
    trimmedNickname.length >= 2 &&
    trimmedNickname.length <= 12 &&
    (
      trimmedNickname === originalNickname ||
      (
        isNicknameAvailable === true &&
        checkedNickname === trimmedNickname
      )
    );

  const handleNicknameCheck = async () => {
    const trimmedNickname = nickname.trim();

    if (trimmedNickname.length < 2 || trimmedNickname.length > 12) {
      alert("닉네임은 2~12자로 입력해주세요.");
      return;
    }

    try {
      const response = await checkNicknameDuplicate(trimmedNickname);

      setIsNicknameAvailable(response.available);
      setCheckedNickname(trimmedNickname);

      alert(
        response.available
          ? "사용할 수 있는 닉네임입니다."
          : "이미 사용 중인 닉네임입니다."
      );
    } catch {
      setIsNicknameAvailable(null);
      setCheckedNickname("");
      alert("닉네임 중복 확인에 실패했습니다.");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate(
      {
        nickname: trimmedNickname
      },
      {
        onSuccess: () => {
          setOriginalNickname(trimmedNickname);
          setNickname(trimmedNickname);
          setIsNicknameAvailable(null);
          setCheckedNickname("");
          setIsEditing(false);
        },
      }
    );
  };
  // 회원 탈퇴
  const handleWithdraw = () => {
    if (window.confirm("정말 회원 탈퇴하시겠습니까?")) {
      alert("회원 탈퇴 API 연결이 필요합니다.");
    }
  };

  return (
    <main
      style={{
        minHeight: "calc(100vh - 82px)",
        backgroundColor: "#f5f6f8",
        padding: "35px 5.5%",
        boxSizing: "border-box",
        color: "#20242c",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 제목 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e2e5eb",
          paddingBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "25px", margin: 0 }}>
          내 정보
        </h1>

        <button
          onClick={() => setIsEditing(!isEditing)}
          style={blueButtonStyle}
        >
          {isEditing ? "내 정보 보기" : "정보 수정"}
        </button>
      </div>

      {isEditing ? (
        /* 내 정보 수정 */
        <section style={{ paddingTop: "30px" }}>
          <h3 style={sectionTitleStyle}>내 정보 수정</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              alignItems: "center",
              maxWidth: "1000px",
              margin: "30px auto",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={avatarStyle}>👤</div>

              <p style={{ fontSize: "13px", fontWeight: 600 }}>
                프로필 이미지
              </p>
            </div>

            
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>닉네임</label>

            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setIsNicknameAvailable(null);
                  setCheckedNickname("");
                }}
                style={{ ...inputStyle, flex: 1 }}
              />

              <button
                type="button"
                onClick={handleNicknameCheck}
                style={blueButtonStyle}
              >
                중복 확인
              </button>
            </div>

            {isNicknameAvailable === true &&
              checkedNickname === nickname.trim() && (
                <p style={{ color: "#16a34a", fontSize: "12px" }}>
                  사용 가능한 닉네임입니다.
                </p>
              )}

            {isNicknameAvailable === false &&
              checkedNickname === nickname.trim() && (
                <p style={{ color: "#e34b4b", fontSize: "12px" }}>
                  이미 사용 중인 닉네임입니다.
                </p>
              )}

              <label
                style={{
                  ...labelStyle,
                  marginTop: "20px",
                }}
              >
                이메일
              </label>

              <input
                value={email}
                readOnly
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={!canSubmit || updateMeMutation.isPending}
                style={{
                  ...blueButtonStyle,
                  marginTop: "25px",
                  opacity: !canSubmit || updateMeMutation.isPending ? 0.55 : 1,
                  cursor: !canSubmit || updateMeMutation.isPending
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {updateMeMutation.isPending ? "저장 중..." : "변경사항 저장"}
              </button>
                변경사항 저장
            </form>
          </div>

          <div style={withdrawStyle}>
            <div>
              <strong style={{ color: "#e34b4b" }}>
                회원 탈퇴
              </strong>

              <p
                style={{
                  fontSize: "11px",
                  color: "#d66b6b",
                }}
              >
                탈퇴하면 계정 정보를 복구할 수 없습니다.
              </p>
            </div>

            <button
              onClick={handleWithdraw}
              style={withdrawButtonStyle}
            >
              회원 탈퇴
            </button>
          </div>
        </section>
      ) : (
        /* 내 정보 조회 */
        <>
          {/* 기본 정보 */}
          <section style={{ padding: "20px 0" }}>
            <h3 style={sectionTitleStyle}>기본 정보</h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                padding: "15px 0",
              }}
            >
              <div style={avatarStyle}>👤</div>

              <div style={{ flex: 1 }}>
                <p style={smallLabelStyle}>닉네임</p>

                <strong style={{ fontSize: "13px" }}>
                  {nickname}
                </strong>
              </div>

              <div style={{ flex: 2 }}>
                <p style={smallLabelStyle}>이메일</p>

                <strong style={{ fontSize: "13px" }}>
                  {email}
                </strong>
              </div>
            </div>
          </section>

          <div
            style={{
              borderTop: "1px solid #e2e5eb",
              margin: "5px 0 20px",
            }}
          />

          {/* 실제 북마크 영화 */}
          <section>
            <h3 style={sectionTitleStyle}>내 즐겨찾기</h3>

            {isLoading ? (
              <p style={messageStyle}>
                즐겨찾기 영화를 불러오는 중입니다...
              </p>
            ) : error ? (
              <p style={{ ...messageStyle, color: "#e34b4b" }}>
                {error}
              </p>
            ) : movies.length === 0 ? (
              <p style={messageStyle}>
                아직 즐겨찾기한 영화가 없습니다.
              </p>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(3, minmax(0, 164px))",
                    gap: "16px",
                    marginTop: "15px",
                  }}
                >
                  {currentMovies.map((movie) => (
                    <div key={movie.id}>
                      {movie.poster_path ? (
                        <img
                          src={`${TMDB_IMAGE_URL}${movie.poster_path}`}
                          alt={movie.title}
                          style={posterStyle}
                        />
                      ) : (
                        <div
                          style={{
                            ...posterStyle,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#e2e5eb",
                          }}
                        >
                          포스터 없음
                        </div>
                      )}

                      <strong
                        style={{
                          display: "block",
                          fontSize: "12px",
                          marginTop: "9px",
                        }}
                      >
                        {movie.title}
                      </strong>

                      <span
                        style={{
                          fontSize: "10px",
                          color: "#9299a5",
                        }}
                      >
                        {movie.release_date || "개봉일 정보 없음"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "15px",
                      marginTop: "35px",
                    }}
                  >
                    <button
                      onClick={() =>
                        setPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={page === 1}
                      style={pageArrowStyle}
                    >
                      ‹
                    </button>

                    <span style={activePageStyle}>
                      {page}
                    </span>

                    <button
                      onClick={() =>
                        setPage((prev) =>
                          Math.min(totalPages, prev + 1)
                        )
                      }
                      disabled={page === totalPages}
                      style={pageArrowStyle}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </>
      )}

      {/* TMDB 안내 */}
      <footer
        style={{
          marginTop: "auto",
          paddingTop: "60px",
          textAlign: "right",
          fontSize: "10px",
          color: "#9299a5",
        }}
      >
        TMDB API를 사용하며 TMDB의 보증이나 인증을 받지 않았습니다.
      </footer>
    </main>
  );
}

const sectionTitleStyle = {
  fontSize: "14px",
  fontWeight: 700,
  margin: "0 0 12px",
};

const smallLabelStyle = {
  color: "#9299a5",
  fontSize: "10px",
  margin: "0 0 5px",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  height: "44px",
  border: "1px solid #e2e5eb",
  borderRadius: "6px",
  padding: "0 12px",
  boxSizing: "border-box" as const,
};

const avatarStyle = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  backgroundColor: "#e2e5eb",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "32px",
};

const blueButtonStyle = {
  backgroundColor: "#2864ed",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "11px 17px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
};

const withdrawStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  marginTop: "30px",
  border: "1px solid #ff7777",
  borderRadius: "7px",
  backgroundColor: "#fff5f5",
};

const withdrawButtonStyle = {
  backgroundColor: "#fff",
  color: "#e34b4b",
  border: "1px solid #ff5555",
  borderRadius: "6px",
  padding: "9px 14px",
  cursor: "pointer",
};

const posterStyle = {
  width: "100%",
  height: "205px",
  objectFit: "cover" as const,
  borderRadius: "9px",
};

const messageStyle = {
  color: "#9299a5",
  fontSize: "13px",
  marginTop: "20px",
};

const pageArrowStyle = {
  border: "none",
  background: "transparent",
  color: "#2864ed",
  fontSize: "20px",
  cursor: "pointer",
};

const activePageStyle = {
  backgroundColor: "#20242c",
  color: "#fff",
  borderRadius: "5px",
  minWidth: "28px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
};

export const Route = createFileRoute("/my")({
  component: MyPage,
});
