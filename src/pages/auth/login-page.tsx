
import { useState, type FormEvent } from "react";
import { useLoginMutation } from "../../hooks/use-login-mutation";

export function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 이메일 형식 검사
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 로그인 Mutation
  const loginMutation = useLoginMutation();

  // 로그인 가능 여부
  const canSubmit =
    EMAIL_REGEX.test(form.email.trim()) &&
    form.password.length > 0;

  // 로그인 제출
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  const inputStyle = {
    width: "100%",
    height: "44px",
    padding: "0 14px",
    border: "1px solid #e2e5eb",
    borderRadius: "6px",
    boxSizing: "border-box" as const,
    outline: "none",
    fontSize: "13px",
    backgroundColor: "#fff",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    marginBottom: "9px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f6f8",
        fontFamily: "Arial, sans-serif",
        color: "#20242c",
      }}
    >
      {/* 로그인 폼 */}
      <main
        style={{
          minHeight: "calc(100vh - 82px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          boxSizing: "border-box",
        }}
      >
        <section style={{ width: "100%", maxWidth: "388px" }}>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 800,
              margin: "0 0 24px",
            }}
          >
            로그인
          </h1>

          <form onSubmit={handleSubmit}>
            {/* 이메일 */}
            <div style={{ marginBottom: "17px" }}>
              <label htmlFor="email" style={labelStyle}>
                이메일
              </label>

              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>

            {/* 비밀번호 */}
            <div style={{ marginBottom: "17px" }}>
              <label htmlFor="password" style={labelStyle}>
                비밀번호
              </label>

              <input
                id="password"
                type="password"
                placeholder="비밀번호"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                style={inputStyle}
              />
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={!canSubmit || loginMutation.isPending}
              style={{
                width: "100%",
                height: "46px",
                border: "none",
                borderRadius: "7px",
                backgroundColor: "#2864ed",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                cursor:
                  !canSubmit || loginMutation.isPending
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  !canSubmit || loginMutation.isPending ? 0.55 : 1,
              }}
            >
              {loginMutation.isPending ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* 회원가입 링크 */}
          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#858c98",
              marginTop: "23px",
            }}
          >
            회원이신가요?{" "}
            <a
              href="/signup"
              style={{
                color: "#2864ed",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              회원가입
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
