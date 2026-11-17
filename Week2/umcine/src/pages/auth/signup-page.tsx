import { useState } from "react";
import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { signup } from "@/api/members/signup";
import { errorMessage } from "@/api/errors";
import { Link, useNavigate } from "@tanstack/react-router";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

export function SignupPage() {
  const navigate = useNavigate();
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
    setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
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
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      if (!response.isSuccess) throw new Error(response.message);
      alert(response.message);
      void navigate({ to: "/login" });
    } catch (error) {
      alert(await errorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };
    
  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
    return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-[400px]"
      >
        <h1 className="mb-5 text-[30px] font-extrabold">회원가입</h1>

        <fieldset disabled={isSubmitting} className="min-w-0">
          {/* 이메일 */}
          <div className="mb-4">
            <label
              htmlFor="signup-email"
              className="mb-2 block text-xs font-bold"
            >
              이메일
            </label>

            <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-blue-600">
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(event) =>
                  handleChangeField("email", event.target.value)
                }
                disabled={duplicateCheck.email.isChecking}
                aria-invalid={showEmailError}
                aria-describedby={
                  showEmailError ? "signup-email-error" : undefined
                }
                className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400 disabled:opacity-50"
              />

              <button
                type="button"
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => void handleCheckDuplicate("email")}
                className="shrink-0 cursor-pointer px-3 text-xs font-bold text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>

            {showEmailError && (
              <p id="signup-email-error" className="mt-2 text-xs text-red-500">
                올바른 이메일을 입력해 주세요.
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div className="mb-4">
            <label
              htmlFor="signup-nickname"
              className="mb-2 block text-xs font-bold"
            >
              닉네임
            </label>

            <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-blue-600">
              <input
                id="signup-nickname"
                type="text"
                autoComplete="nickname"
                placeholder="2~12자"
                value={form.nickname}
                onChange={(event) =>
                  handleChangeField("nickname", event.target.value)
                }
                disabled={duplicateCheck.nickname.isChecking}
                aria-invalid={showNicknameError}
                aria-describedby={
                  showNicknameError ? "signup-nickname-error" : undefined
                }
                className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400 disabled:opacity-50"
              />

              <button
                type="button"
                disabled={
                  !isNicknameValid || duplicateCheck.nickname.isChecking
                }
                onClick={() => void handleCheckDuplicate("nickname")}
                className="shrink-0 cursor-pointer px-3 text-xs font-bold text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {duplicateCheck.nickname.isChecking
                  ? "확인 중"
                  : "중복 확인"}
              </button>
            </div>

            {showNicknameError && (
              <p
                id="signup-nickname-error"
                className="mt-2 text-xs text-red-500"
              >
                닉네임은 2~12자로 입력해 주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="mb-4">
            <label
              htmlFor="signup-password"
              className="mb-2 block text-xs font-bold"
            >
              비밀번호
            </label>

            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              placeholder="8자 이상"
              value={form.password}
              onChange={(event) =>
                handleChangeField("password", event.target.value)
              }
              aria-invalid={showPasswordError}
              aria-describedby="signup-password-help"
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600"
            />

            <p
              id="signup-password-help"
              className={`mt-2 text-[11px] ${
                showPasswordError ? "text-red-500" : "text-slate-400"
              }`}
            >
              영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해
              8자 이상 입력해 주세요.
            </p>
          </div>

          {/* 비밀번호 확인 */}
          <div className="mb-4">
            <label
              htmlFor="signup-password-confirm"
              className="mb-2 block text-xs font-bold"
            >
              비밀번호 확인
            </label>

            <input
              id="signup-password-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="다시 입력"
              value={form.passwordConfirm}
              onChange={(event) =>
                handleChangeField("passwordConfirm", event.target.value)
              }
              aria-invalid={showPasswordConfirmError}
              aria-describedby={
                showPasswordConfirmError
                  ? "signup-password-confirm-error"
                  : undefined
              }
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600"
            />

            {showPasswordConfirmError && (
              <p
                id="signup-password-confirm-error"
                className="mt-2 text-xs text-red-500"
              >
                비밀번호가 일치하지 않아요.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="h-11 w-full cursor-pointer rounded-md bg-blue-600 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </fieldset>

        <p className="mt-5 text-center text-xs text-slate-500">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-bold text-blue-600">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}