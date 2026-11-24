import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/members/update-me";

// 내 정보 수정 요청과 캐시 갱신을 관리하는 커스텀 훅
export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    // 닉네임 수정 시 PATCH /me 요청
    mutationFn: updateMe,

    // 수정 성공 시 실행
    onSuccess: (updatedMember) => {
      // 서버에서 받은 최신 회원 정보로 기존 캐시를 갱신
      queryClient.setQueryData(["members", "me"], updatedMember);

      alert("내 정보가 수정되었습니다.");
    },

    // 수정 실패 시 실행
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
