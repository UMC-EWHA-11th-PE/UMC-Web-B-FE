
import { useState, type FormEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useSignupMutation } from "../../hooks/use-signup-mutation";
// import { useNavigate } from "@tanstack/react-router";
const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const signupMutation = useSignupMutation();
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  const isNicknameValid =
    form.nickname.trim().length >= 2 &&
    form.nickname.trim().length <= 12;

  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 &&
    form.password === form.passwordConfirm;

  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;
const canSubmit =
  isFormValid &&
  duplicateCheck.email.isAvailable &&
  duplicateCheck.nickname.isAvailable;

  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError =
    form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError =
    form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  const handleChangeField = (
    key: DefaultFormKey,
    value: DefaultFormValue
    ) => {
    if (key === "email" || key === "nickname") {
        setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
        }));
    }

    setForm((prev) => ({ ...prev, [key]: value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || signupMutation.isPending) return;

    signupMutation.mutate({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
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
    color: "#20242c",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#22252b",
    marginBottom: "9px",
  };

  const fieldStyle = {
    marginBottom: "17px",
  };

  const checkButtonStyle = {
    position: "absolute" as const,
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#2864ed",
    fontSize: "11px",
    fontWeight: 600,
    cursor: "pointer",
  };

    const handleCheckDuplicate = async (
    key: DuplicateCheckKey
    ) => {
    const isValid =
        key === "email" ? isEmailValid : isNicknameValid;

     if (!isValid) {
        alert("입력값을 올바르게 작성해주세요.");
        return;
    }

    const label = key === "email" ? "이메일" : "닉네임";

    setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { isChecking: true, isAvailable: false },
     }));

    try {
        const response =
         key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());

        const isAvailable = response.available;

        setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { isChecking: false, isAvailable },
        }));

        alert(
        isAvailable
            ? `사용할 수 있는 ${label}입니다.`
            : `이미 사용 중인 ${label}입니다.`
        );
    } catch {
        setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
        }));

        alert("중복 확인에 실패했습니다. 다시 시도해주세요.");
    } finally {
        setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
            ...prev[key],
            isChecking: false,
        },
        }));
    }
};
return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflowY: "auto",
        backgroundColor: "#f5f6f8",
        fontFamily: "Arial, sans-serif",
        color: "#20242c",
      }}
    >
      {/* 상단 헤더 */}
      <header
        style={{
          height: "82px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #edf0f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 5.5%",
        }}
      >
        {/* 로고 및 메뉴 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "38px",
          }}
        >
          <a
            href="/"
            style={{
              textDecoration: "none",
              color: "#17191e",
              fontWeight: 800,
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                border: "2px solid #222",
                borderRadius: "7px",
                padding: "4px",
                fontSize: "14px",
              }}
            >
              ▣
            </span>
            UMCine
          </a>

          <nav
            style={{
              display: "flex",
              gap: "30px",
              fontSize: "12px",
            }}
          >
            <a href="/movies" style={navStyle}>영화</a>
            <a href="/search" style={navStyle}>검색</a>
            <a href="/my" style={navStyle}>내 정보</a>
          </nav>
        </div>

        {/* 검색 및 로그인 */}
        <div style={{ display: "flex", gap: "12px" }}>
          <a
            href="/search"
            style={{
              width: "38px",
              height: "38px",
              border: "1px solid #e2e5eb",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              color: "#555",
              fontSize: "18px",
            }}
          >
            ⌕
          </a>

          <a
            href="/login"
            style={{
              backgroundColor: "#2864ed",
              color: "#fff",
              textDecoration: "none",
              padding: "0 18px",
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            로그인
          </a>
        </div>
      </header>

      {/* 회원가입 영역 */}
      <main
        style={{
          minHeight: "calc(100vh - 82px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px 20px",
          boxSizing: "border-box",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: "388px",
          }}
        >
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 800,
              margin: "0 0 24px",
              color: "#20242c",
            }}
          >
            회원가입
          </h1>

          <form onSubmit={handleSubmit} noValidate>
            {/* 이메일 */}
            <div style={fieldStyle}>
              <label htmlFor="email" style={labelStyle}>
                이메일
              </label>

              <div style={{ position: "relative" }}>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) =>
                    handleChangeField("email", e.target.value)
                  }
                  style={inputStyle}
                />

                <button
                  type="button"
                  onClick={() => handleCheckDuplicate("nickname")}
                  disabled={duplicateCheck.nickname.isChecking}
                  style={checkButtonStyle}
                >
                  {duplicateCheck.nickname.isChecking
                    ? "확인 중..."
                    : "중복 확인"}
                </button> 
              </div>

              {showEmailError && (
                <p style={errorStyle}>
                  올바른 이메일 형식으로 입력해주세요.
                </p>
              )}
            </div>

            {/* 닉네임 */}
            <div style={fieldStyle}>
              <label htmlFor="nickname" style={labelStyle}>
                닉네임
              </label>

              <div style={{ position: "relative" }}>
                <input
                  id="nickname"
                  type="text"
                  placeholder="2~12자"
                  value={form.nickname}
                  onChange={(e) =>
                    handleChangeField("nickname", e.target.value)
                  }
                  style={inputStyle}
                />

                <button
                type="button"
                onClick={() => handleCheckDuplicate("email")}
                disabled={duplicateCheck.email.isChecking}
                style={checkButtonStyle}
                >
                {duplicateCheck.email.isChecking
                    ? "확인 중..."
                    : "중복 확인"}
                </button>
              </div>

              {showNicknameError && (
                <p style={errorStyle}>
                  닉네임은 2~12자로 입력해주세요.
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div style={fieldStyle}>
              <label htmlFor="password" style={labelStyle}>
                비밀번호
              </label>

              <input
                id="password"
                type="password"
                placeholder="8자 이상"
                value={form.password}
                onChange={(e) =>
                  handleChangeField("password", e.target.value)
                }
                style={inputStyle}
              />

              <p
                style={{
                  fontSize: "11px",
                  color: "#969da9",
                  margin: "8px 0 0",
                }}
              >
                영문 대소문자, 숫자, 특수문자를 모두 포함해
                8자 이상 입력해 주세요.
              </p>

              {showPasswordError && (
                <p style={errorStyle}>
                  비밀번호 형식이 올바르지 않습니다.
                </p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div style={fieldStyle}>
              <label
                htmlFor="passwordConfirm"
                style={labelStyle}
              >
                비밀번호 확인
              </label>

              <input
                id="passwordConfirm"
                type="password"
                placeholder="다시 입력"
                value={form.passwordConfirm}
                onChange={(e) =>
                  handleChangeField(
                    "passwordConfirm",
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              {showPasswordConfirmError && (
                <p style={errorStyle}>
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>

            {/* 가입하기 버튼 */}
            <button
              type="submit"
              disabled={!canSubmit || signupMutation.isPending}
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
                  canSubmit && !signupMutation.isPending
                    ? "pointer"
                    : "not-allowed",
                opacity: canSubmit && !signupMutation.isPending ? 1 : 0.55,
                marginTop: "3px",
              }}
            >
              {signupMutation.isPending ? "가입 중..." : "가입하기"}
            </button>
            
          </form>

          {/* 로그인 링크 */}
          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#858c98",
              marginTop: "23px",
            }}
          >
            이미 계정이 있으신가요?{" "}
            <a
              href="/login"
              style={{
                color: "#2864ed",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              로그인
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}

const navStyle = {
  color: "#555d69",
  textDecoration: "none",
};
const errorStyle = {
  color: "#e34b4b",
  fontSize: "11px",
  margin: "6px 0 0",
};
