//로그인 성공 처리하기
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { readToken } from "../api/session";
import { useAuthStore } from "../stores/auth-store";
import { useProfileStore } from "../stores/profile-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const { accessToken, nickname } = response.result;
      const claims = readToken(accessToken);
      if (!claims) throw new Error("Invalid login token");

      updateProfile({ email: claims.email, nickname, image: "" });
      setAccessToken(accessToken);
      alert("로그인에 성공했어요.");
      queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      navigate({ to: "/" });
    },
    onError: () => {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}