"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { errorMessage } from "../lib/error";
import { checkDuplicate, signup, type DuplicateField } from "../members/signup";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

const duplicateFields = [
  { name: "email", label: "이메일", type: "email" },
  { name: "nickname", label: "닉네임", type: "text" },
] as const;

type DuplicateCheck = {
  checking: boolean;
  availableValue: string;
  message: string;
};

const emptyCheck: DuplicateCheck = {
  checking: false,
  availableValue: "",
  message: "",
};

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600";

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });
  const [checks, setChecks] = useState<Record<DuplicateField, DuplicateCheck>>({
    email: emptyCheck,
    nickname: emptyCheck,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const values = {
    email: form.email.trim(),
    nickname: form.nickname.trim(),
  };
  const valid = {
    email: EMAIL_REGEX.test(values.email),
    nickname: values.nickname.length >= 2 && values.nickname.length <= 12,
  };
  const passwordValid = PASSWORD_REGEX.test(form.password);
  const passwordsMatch =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  const canSubmit =
    valid.email &&
    valid.nickname &&
    passwordValid &&
    passwordsMatch &&
    !checks.email.checking &&
    !checks.nickname.checking &&
    checks.email.availableValue === values.email &&
    checks.nickname.availableValue === values.nickname;

  async function handleDuplicateCheck(field: DuplicateField, label: string) {
    if (!valid[field] || checks[field].checking || isSubmitting) return;

    const value = values[field];
    setChecks((current) => ({
      ...current,
      [field]: { ...emptyCheck, checking: true },
    }));

    try {
      const { available } = await checkDuplicate(field, value);

      setChecks((current) => ({
        ...current,
        [field]: {
          checking: false,
          availableValue: available ? value : "",
          message: available
            ? `사용할 수 있는 ${label}이에요.`
            : `이미 사용 중인 ${label}이에요.`,
        },
      }));
    } catch (error) {
      const message = await errorMessage(error);
      setChecks((current) => ({
        ...current,
        [field]: { ...emptyCheck, message },
      }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await signup({ ...values, password: form.password });
      router.replace("/login");
    } catch (error) {
      setSubmitError(await errorMessage(error));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      <fieldset disabled={isSubmitting} className="min-w-0 space-y-4">
        {duplicateFields.map(({ name, label, type }) => {
          const check = checks[name];
          const invalid = form[name].length > 0 && !valid[name];
          const message = invalid
            ? name === "email"
              ? "올바른 이메일을 입력해 주세요."
              : "닉네임은 2~12자로 입력해 주세요."
            : check.message;

          return (
            <div key={name}>
              <label htmlFor={`signup-${name}`} className="mb-2 block text-sm font-bold">
                {label}
              </label>
              <div className="flex gap-2">
                <input
                  id={`signup-${name}`}
                  name={name}
                  type={type}
                  autoComplete={name}
                  value={form[name]}
                  disabled={check.checking}
                  aria-invalid={invalid}
                  aria-describedby={`signup-${name}-message`}
                  onChange={(event) => {
                    const value = event.target.value;
                    setForm((current) => ({ ...current, [name]: value }));
                    setChecks((current) => ({ ...current, [name]: emptyCheck }));
                    setSubmitError("");
                  }}
                  className={`${inputClass} min-w-0 flex-1`}
                />
                <button
                  type="button"
                  disabled={!valid[name] || check.checking}
                  onClick={() => void handleDuplicateCheck(name, label)}
                  className="shrink-0 rounded-lg border border-slate-300 px-3 text-xs font-bold disabled:opacity-50"
                >
                  {check.checking ? "확인 중" : "중복 확인"}
                </button>
              </div>
              <p
                id={`signup-${name}-message`}
                role="status"
                className={`mt-1 text-xs ${check.availableValue ? "text-green-600" : "text-red-600"}`}
              >
                {message}
              </p>
            </div>
          );
        })}

        <div>
          <label htmlFor="signup-password" className="mb-2 block text-sm font-bold">
            비밀번호
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            aria-invalid={form.password.length > 0 && !passwordValid}
            aria-describedby="signup-password-help"
            onChange={(event) => {
              const password = event.target.value;
              setForm((current) => ({ ...current, password }));
              setSubmitError("");
            }}
            className={inputClass}
          />
          <p id="signup-password-help" className="mt-1 text-xs text-slate-500">
            영문 대문자, 소문자, 숫자, 특수문자(!@#$%^&amp;*)를 포함해 8자 이상
            입력해 주세요.
          </p>
        </div>

        <div>
          <label htmlFor="signup-password-confirm" className="mb-2 block text-sm font-bold">
            비밀번호 확인
          </label>
          <input
            id="signup-password-confirm"
            type="password"
            autoComplete="new-password"
            value={form.passwordConfirm}
            aria-invalid={form.passwordConfirm.length > 0 && !passwordsMatch}
            aria-describedby="signup-password-confirm-message"
            onChange={(event) => {
              const passwordConfirm = event.target.value;
              setForm((current) => ({ ...current, passwordConfirm }));
              setSubmitError("");
            }}
            className={inputClass}
          />
          <p id="signup-password-confirm-message" className="mt-1 text-xs text-red-600">
            {form.passwordConfirm && !passwordsMatch
              ? "비밀번호가 일치하지 않아요."
              : ""}
          </p>
        </div>

        {submitError && (
          <p role="alert" className="text-sm text-red-600">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="h-11 w-full rounded-md bg-blue-600 text-sm font-bold text-white disabled:opacity-50"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>
      </fieldset>

      <p className="mt-5 text-center text-sm text-slate-500">
        이미 계정이 있나요?{" "}
        <Link href="/login" className="font-bold text-blue-600">
          로그인
        </Link>
      </p>
    </form>
  );
}