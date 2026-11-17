
import { useState, type SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useSignupMutation } from "../../hooks/use-signup-mutation";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 영문 대문자, 소문자, 숫자, 특수문자 포함 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  // 회원가입 입력값
  const [form, setForm] = useState(DEFAULT_FORM);

  // 이메일·닉네임 중복 확인 상태
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: { ...DEFAULT_DUPLICATE_CHECK },
    nickname: { ...DEFAULT_DUPLICATE_CHECK },
  });

  // 회원가입 요청 상태 관리
  const signupMutation = useSignupMutation();

  // 입력값 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  const isNicknameValid =
    form.nickname.trim().length >= 2 &&
    form.nickname.trim().length <= 12;

  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 &&
    form.password === form.passwordConfirm;

  // 입력값이 존재할 때 오류 표시
  const showEmailError =
    form.email.length > 0 && !isEmailValid;

  const showNicknameError =
    form.nickname.length > 0 && !isNicknameValid;

  const showPasswordError =
    form.password.length > 0 && !isPasswordValid;

  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 &&
    !isPasswordConfirmValid;

  // 모든 입력 조건 검사
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  // 입력 조건 + 중복 확인 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable &&
    !duplicateCheck.email.isChecking &&
    !duplicateCheck.nickname.isChecking;

  // 입력값 변경
  const handleChangeField = (
    key: DefaultFormKey,
    value: DefaultFormValue
  ) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;

      // 중복 확인 이후 값을 바꾸면 결과 초기화
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...DEFAULT_DUPLICATE_CHECK },
      }));
    }

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 이메일·닉네임 중복 확인
  const handleCheckDuplicate = async (
    key: DuplicateCheckKey
  ) => {
    const isValid =
      key === "email" ? isEmailValid : isNicknameValid;

    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";

    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: {
        isChecking: true,
        isAvailable: false,
      },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());

      const isAvailable = response.available;

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isAvailable,
        },
      }));

      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isAvailable: false,
        },
      }));

      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
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

  // 회원가입 API 요청 - useMutation 적용
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || signupMutation.isPending) return;

    signupMutation.mutate({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
      password: form.password,
    });
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#F7F8FA] px-4 py-12">
      <div className="w-full max-w-[376px]">
        <h1 className="mb-5 text-[28px] font-bold text-[#191B20]">
          회원가입
        </h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >
          {/* 이메일 */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-semibold text-[#191B20]"
            >
              이메일
            </label>

            <div className="flex h-11 items-center rounded-md border border-[#E2E5EA] bg-white focus-within:border-[#4B63E6]">
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                disabled={
                  duplicateCheck.email.isChecking ||
                  signupMutation.isPending
                }
                onChange={(e) =>
                  handleChangeField("email", e.target.value)
                }
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#A0A8B8] disabled:cursor-not-allowed disabled:bg-gray-50"
              />

              <button
                type="button"
                disabled={
                  !isEmailValid ||
                  duplicateCheck.email.isChecking ||
                  signupMutation.isPending
                }
                onClick={() => handleCheckDuplicate("email")}
                className="shrink-0 px-3 text-xs font-semibold text-[#4B63E6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {duplicateCheck.email.isChecking
                  ? "확인 중"
                  : "중복 확인"}
              </button>
            </div>

            {showEmailError && (
              <p className="mt-1 text-xs text-red-500">
                올바른 이메일 형식을 입력해주세요.
              </p>
            )}

            {duplicateCheck.email.isAvailable && (
              <p className="mt-1 text-xs text-green-600">
                사용 가능한 이메일입니다.
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div>
            <label
              htmlFor="nickname"
              className="mb-2 block text-xs font-semibold text-[#191B20]"
            >
              닉네임
            </label>

            <div className="flex h-11 items-center rounded-md border border-[#E2E5EA] bg-white focus-within:border-[#4B63E6]">
              <input
                id="nickname"
                type="text"
                placeholder="2-12자"
                value={form.nickname}
                disabled={
                  duplicateCheck.nickname.isChecking ||
                  signupMutation.isPending
                }
                onChange={(e) =>
                  handleChangeField("nickname", e.target.value)
                }
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#A0A8B8] disabled:cursor-not-allowed disabled:bg-gray-50"
              />

              <button
                type="button"
                disabled={
                  !isNicknameValid ||
                  duplicateCheck.nickname.isChecking ||
                  signupMutation.isPending
                }
                onClick={() => handleCheckDuplicate("nickname")}
                className="shrink-0 px-3 text-xs font-semibold text-[#4B63E6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {duplicateCheck.nickname.isChecking
                  ? "확인 중"
                  : "중복 확인"}
              </button>
            </div>

            {showNicknameError && (
              <p className="mt-1 text-xs text-red-500">
                닉네임은 2~12자로 입력해주세요.
              </p>
            )}

            {duplicateCheck.nickname.isAvailable && (
              <p className="mt-1 text-xs text-green-600">
                사용 가능한 닉네임입니다.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-semibold text-[#191B20]"
            >
              비밀번호
            </label>

            <input
              id="password"
              type="password"
              placeholder="8자 이상"
              value={form.password}
              disabled={signupMutation.isPending}
              onChange={(e) =>
                handleChangeField("password", e.target.value)
              }
              className="h-11 w-full rounded-md border border-[#E2E5EA] bg-white px-3 text-sm outline-none placeholder:text-[#A0A8B8] focus:border-[#4B63E6] disabled:bg-gray-50"
            />

            <p className="mt-1 text-[11px] text-[#A0A8B8]">
              영문 대·소문자, 숫자, 특수문자를 모두 포함해
              8자 이상 입력해 주세요.
            </p>

            {showPasswordError && (
              <p className="mt-1 text-xs text-red-500">
                비밀번호 조건을 충족하지 않았습니다.
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label
              htmlFor="passwordConfirm"
              className="mb-2 block text-xs font-semibold text-[#191B20]"
            >
              비밀번호 확인
            </label>

            <input
              id="passwordConfirm"
              type="password"
              placeholder="다시 입력"
              value={form.passwordConfirm}
              disabled={signupMutation.isPending}
              onChange={(e) =>
                handleChangeField(
                  "passwordConfirm",
                  e.target.value
                )
              }
              className="h-11 w-full rounded-md border border-[#E2E5EA] bg-white px-3 text-sm outline-none placeholder:text-[#A0A8B8] focus:border-[#4B63E6] disabled:bg-gray-50"
            />

            {showPasswordConfirmError && (
              <p className="mt-1 text-xs text-red-500">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          {/* 가입하기 */}
          <button
            type="submit"
            disabled={!canSubmit || signupMutation.isPending}
            className="mt-2 h-11 w-full rounded-md bg-[#4B63E6] text-sm font-semibold text-white transition-colors hover:bg-[#3D53D0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {signupMutation.isPending ? "가입 중..." : "가입하기"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[#8D95A5]">
          이미 계정이 있나요?{" "}
          <span className="font-semibold text-[#4B63E6]">
            로그인
          </span>
        </p>
      </div>
    </main>
  );
}
