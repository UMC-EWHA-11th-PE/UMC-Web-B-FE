import { useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";

// 이메일 형식 검사 (문자@문자.문자)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 영문 대문자, 소문자, 숫자, 특수문자를 모두 포함한 8자 이상 비밀번호
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

// 회원가입 폼의 초기 입력값
const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

// 이메일과 닉네임 중복 확인의 초기 상태
const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false, // 서버에 중복 확인 요청 중인지
  isAvailable: false, // 사용 가능한 이메일 또는 닉네임인지
};

// 중복 확인 대상은 이메일 또는 닉네임
type DuplicateCheckKey = "email" | "nickname";

// 입력 필드의 이름과 값에 대한 타입
type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

export function SignupPage() {
  // 회원가입 입력값을 하나의 객체로 관리
  const [form, setForm] = useState(DEFAULT_FORM);

  // 회원가입 API 요청이 진행 중인지 관리
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이메일과 닉네임의 중복 확인 결과를 각각 관리
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: { ...DEFAULT_DUPLICATE_CHECK },
    nickname: { ...DEFAULT_DUPLICATE_CHECK },
  });

  // 각 입력값이 조건을 만족하는지 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;

  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 모든 입력값이 유효한 경우에만 true
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  // 입력값 검증과 이메일·닉네임 중복 확인을 모두 통과해야 가입 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  // 입력을 시작한 필드에만 오류 메시지를 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 입력값이 변경되면 해당 필드의 중복 확인 결과를 초기화
  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      // 중복 확인 요청 중에는 입력값 변경 방지
      if (duplicateCheck[key].isChecking) return;

      // 확인했던 이메일이나 닉네임이 변경되면 다시 중복 확인 필요
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...DEFAULT_DUPLICATE_CHECK },
      }));
    }

    // 기존 입력값은 유지하고 변경한 필드만 업데이트
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 이메일 또는 닉네임 중복 확인 API 호출
  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    // 입력 형식이 올바르지 않거나 이미 확인 중이면 요청하지 않음
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";

    // 중복 확인 요청 시작
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      // 이메일과 닉네임에 따라 서로 다른 API 호출
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());

      const isAvailable = response.available;

      // 서버에서 받은 중복 확인 결과 저장
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));

      // 중복 확인 결과 안내
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      // 요청 실패 시 사용 불가능 상태로 처리
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));

      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      // 성공 여부와 관계없이 요청 상태 종료
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  // 회원가입 폼 제출 및 API 요청
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    // 입력값이나 중복 확인이 유효하지 않거나 이미 요청 중이면 중단
    if (!canSubmit || isSubmitting) return;

    // 회원가입 요청 시작
    setIsSubmitting(true);

    try {
      // Spring Boot 서버에 회원가입 POST 요청
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });

      // 서버에서 받은 회원가입 결과 메시지 표시
      alert(response.message);

      // 로그인 페이지 구현 후 이동 기능 추가 예정
      // navigate({ to: "/login" });
    } catch {
      // 회원가입 요청 실패 시 오류 메시지 표시
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      // 성공 여부와 관계없이 요청 상태 종료
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-md"
      >
        <h1 className="mb-8 text-center text-2xl font-bold">회원가입</h1>

        {/* 이메일 입력 */}

        {/* 이메일 입력 */}
        <div>
          <label htmlFor="email" className="mb-2 block font-medium">
            이메일
          </label>

          <div className="flex gap-2">
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              disabled={duplicateCheck.email.isChecking}
              className="min-w-0 flex-1 rounded-lg border p-3"
            />

            {/* 이메일 중복 확인 버튼 */}
            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
              className="shrink-0 rounded-lg bg-gray-700 px-4 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>

          {/* 이메일 형식 오류 메시지 */}
          {showEmailError && (
            <p className="mt-1 text-sm text-red-500">
              올바른 이메일 형식으로 입력해 주세요.
            </p>
          )}

          {/* 이메일 중복 확인 성공 메시지 */}
          {duplicateCheck.email.isAvailable && (
            <p className="mt-1 text-sm text-green-600">
              사용 가능한 이메일입니다.
            </p>
          )}
        </div>

        {/* 닉네임 입력 */}

        {/* 닉네임 입력 */}
        <div>
          <label htmlFor="nickname" className="mb-2 block font-medium">
            닉네임
          </label>

          <div className="flex gap-2">
            <input
              id="nickname"
              type="text"
              placeholder="2~12자"
              value={form.nickname}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
              disabled={duplicateCheck.nickname.isChecking}
              className="min-w-0 flex-1 rounded-lg border p-3"
            />

            {/* 닉네임 중복 확인 버튼 */}
            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
              className="shrink-0 rounded-lg bg-gray-700 px-4 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>

          {/* 닉네임 길이 오류 메시지 */}
          {showNicknameError && (
            <p className="mt-1 text-sm text-red-500">
              닉네임은 2~12자로 입력해 주세요.
            </p>
          )}

          {/* 닉네임 중복 확인 성공 메시지 */}
          {duplicateCheck.nickname.isAvailable && (
            <p className="mt-1 text-sm text-green-600">
              사용 가능한 닉네임입니다.
            </p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label htmlFor="password" className="mb-2 block font-medium">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="영문 대소문자, 숫자, 특수문자 포함 8자 이상"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            className="w-full rounded-lg border p-3"
          />
          {showPasswordError && (
            <p className="mt-1 text-sm text-red-500">
              영문 대소문자, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요.
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label htmlFor="passwordConfirm" className="mb-2 block font-medium">
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요"
            value={form.passwordConfirm}
            onChange={(e) =>
              handleChangeField("passwordConfirm", e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />
          {showPasswordConfirmError && (
            <p className="mt-1 text-sm text-red-500">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        {/* 입력값과 중복 확인을 통과해야 회원가입 가능 */}
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>
      </form>
    </main>
  );
}
