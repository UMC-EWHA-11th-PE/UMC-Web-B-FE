import {type FormEvent} from "react";
import {Link} from "react-router";
import "./login-page.css";

export default function LoginPage(){
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // 로그인 API가 준비되면 여기에서 인증 요청을 연결합니다.
  }

  return (
    <main className="login-page">
        <section className="login-panel" aria-labelledby="login-title">
            <h1 id="login-title">로그인</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="login-email">이메일</label>
                <div className="login-input">
                    <img src="/icons/mail.svg" alt=""/>
                    <input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                    />
                </div>

                <label htmlFor="login-password">비밀번호</label>
                <div className="login-input">
                    <img src="/icons/lock.svg" alt=""/>
                    <input 
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        autoComplete="current-password"
                        required
                    />
                </div>
                
                <button className="login-submit" type="submit">
                    로그인
                </button>
            </form>
            <p className="signup-guide">처음이신가요? <Link to="/signup">
            회원가입</Link></p>
        </section>
    </main>
  )
}