import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-[400px]">
        <h1 className="mb-5 text-3xl font-extrabold">회원가입</h1>
        <SignupForm />
      </div>
    </main>
  );
}