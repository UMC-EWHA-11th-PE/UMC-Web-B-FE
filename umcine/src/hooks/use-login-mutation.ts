import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

// 로그인 요청과 성공/실패 처리를 관리하는 커스텀 훅
export function useLoginMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    // 로그인 버튼을 누르면 실행할 API 함수
    mutationFn: login,

    // 로그인 성공 시 실행
    onSuccess: async (response) => {
      // 1. 서버에서 발급받은 JWT를 Zustand에 저장
      setAccessToken(response.result.accessToken);

      // 2. 기존 내 정보 캐시를 무효화하여 최신 정보 조회
      await queryClient.invalidateQueries({
        queryKey: ["members", "me"],
      });

      // 3. 로그인 성공 후 메인 페이지로 이동
      await navigate({ to: "/" });
    },

    // 로그인 실패 시 실행
    onError: () => {
      alert("로그인에 실패했어요. 이메일과 비밀번호를 확인해 주세요.");
    },
  });
}
