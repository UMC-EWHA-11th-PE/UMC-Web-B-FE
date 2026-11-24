import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRating } from "../api/ratings/update-rating";

// 평점 수정 Hook
export const useUpdateRatingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRating,

    onSuccess: () => {
      // 수정된 평점이 목록에 반영되도록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["ratings"],
      });

      alert("평점이 수정되었습니다.");
    },

    onError: () => {
      alert("평점 수정에 실패했습니다.");
    },
  });
};
