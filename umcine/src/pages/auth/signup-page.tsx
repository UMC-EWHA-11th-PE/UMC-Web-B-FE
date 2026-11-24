import { useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
// import { useNavigate } from "@tanstack/react-router";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const navigate = useNavigate();

  const [form, setForm] = useState(DEFAULT_FORM);

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효하면 제출 버튼 활성화
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

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
        [key]: { ...prev[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      // 로그인 페이지 연결 후 주석 해제
      // navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const INPUT_CLASS =
    "w-full border border-gray-200 bg-white px-3 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600";
  const CHECK_BUTTON_CLASS =
    "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600";
  const ERROR_CLASS = "mt-1 text-xs text-red-600";

  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-24">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex w-full max-w-sm flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">회원가입</h1>

        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-bold">
            이메일
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              className={`${INPUT_CLASS} pr-20`}
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              aria-invalid={showEmailError}
            />
            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
              className={CHECK_BUTTON_CLASS}
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <p role="alert" className={ERROR_CLASS}>
              올바른 이메일 형식이 아니에요.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="nickname" className="mb-1 block text-xs font-bold">
            닉네임
          </label>
          <div className="relative">
            <input
              id="nickname"
              type="text"
              autoComplete="nickname"
              placeholder="2~12자"
              className={`${INPUT_CLASS} pr-20`}
              value={form.nickname}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
              aria-invalid={showNicknameError}
            />
            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
              className={CHECK_BUTTON_CLASS}
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showNicknameError && (
            <p role="alert" className={ERROR_CLASS}>
              닉네임은 2자 이상 12자 이하로 입력해 주세요.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-bold">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="8자 이상"
            className={INPUT_CLASS}
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            aria-invalid={showPasswordError}
          />
          <p
            role={showPasswordError ? "alert" : undefined}
            className={`mt-1 text-xs ${showPasswordError ? "text-red-600" : "text-gray-400"}`}
          >
            영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.
          </p>
        </div>

        <div>
          <label
            htmlFor="passwordConfirm"
            className="mb-1 block text-xs font-bold"
          >
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="다시 입력"
            className={INPUT_CLASS}
            value={form.passwordConfirm}
            onChange={(e) =>
              handleChangeField("passwordConfirm", e.target.value)
            }
            aria-invalid={showPasswordConfirmError}
          />
          {showPasswordConfirmError && (
            <p role="alert" className={ERROR_CLASS}>
              비밀번호가 일치하지 않아요.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="text-center text-xs text-gray-500">
          이미 계정이 있나요?{" "}
          <a href="/login" className="font-bold text-blue-600">
            로그인
          </a>
        </p>
      </form>
    </main>
  );
}
