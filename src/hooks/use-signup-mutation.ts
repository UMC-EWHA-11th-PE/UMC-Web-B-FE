import { useMutation } from "@tanstack/react-query";
import { signup } from "../api/members/signup";
import { useQueryClient } from "@tanstack/react-query";

export function useSignupMutation() {
  // const navigate = useNavigate();
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      alert(response.message);
      
      queryClient.invalidateQueries({
    queryKey: ["members", "me"],
    });
      // 로그인 페이지 연결 후 주석 해제
      // navigate({ to: "/login" });
    },
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}