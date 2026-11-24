import LoginGuard from "./login-guard";

// 로그인 페이지
// 실제 인증 상태 확인은 Client Component에서 처리
export default function Page() {
  return <LoginGuard />;
}
