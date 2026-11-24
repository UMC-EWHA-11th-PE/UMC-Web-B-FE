import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup } from "../api/members/signup";

export function useSignupMutation() {
  const navigate = useNavigate();

  return useMutation({
    // 회원가입 API 요청 함수
    mutationFn: signup,

    // 회원가입 성공 시 실행
    onSuccess: (response) => {
      alert(response.message);

      // 회원가입 성공 후 로그인 페이지로 이동
      navigate({ to: "/login" });
    },

    // 회원가입 실패 시 실행
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
