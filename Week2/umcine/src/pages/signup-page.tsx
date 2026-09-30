import {useState, type FormEvent} from "react";
import {Link} from "react-router"
import "./signup-page.css"

export default function SignupPage(){
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm]=useState("");
    const [error, setError]=useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();

        if(password!==passwordConfirm){
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }
        setError("");
        //회원가입 api

    }

    return (
        <main className="signup-page">
            <section className="signup-panel" aria-labelledby="signup-title">
                <h1 id="signup-title">회원가입</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="signup-email">이메일</label>
                    <div className="signup-input with-button">
                        <input id="signup-email" name="email"
                        type="email" placeholder="name@example.com" autoComplete="email" required/>
                        <button type="button" onClick={()=>{
                            //이메일 중복 확인 api
                        }}>중복 확인</button>

                    </div>

                    <label htmlFor="signup-nickname">닉네임</label>
                    <div className="signup-input with-button">
                        <input id="signup-nickname" name="nickname"
                            type="text" placeholder="2-12자" minLength={2} maxLength={12}
                            autoComplete="nickname"required/>
                        <button type="button" onClick={()=>{
                            //닉네임 중복 확인
                        }}>중복 확인</button>
                    </div>
                    <label htmlFor="signup-password">비밀번호</label>
                    
                    
                    <div className="signup-input">
                        <input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="8자 이상"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}"
                        title="영문 대문자, 소문자, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요."
                        autoComplete="new-password"
                        required
                        />
                    </div>
                    <p className="password-guide">
                        영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.
                    </p>

                    <label htmlFor="signup-password-confirm">비밀번호 확인</label>
                    <div className="signup-input confirm-input">
                        <input
                        id="signup-password-confirm"
                        name="passwordConfirm"
                        type="password"
                        placeholder="다시 입력"
                        value={passwordConfirm}
                        onChange={(event) => setPasswordConfirm(event.target.value)}
                        autoComplete="new-password"
                        required
                        />      
                        </div>

                        {error&&<p className="signup-error" role="alert">{error}</p>}
                        <button className="signup-submit" type="submit">가입하기</button>
                </form>
                <p className="login-guide">이미 계정이 있나요?<Link to="/login">로그인</Link></p>
            

            </section>
        </main>
    )
}