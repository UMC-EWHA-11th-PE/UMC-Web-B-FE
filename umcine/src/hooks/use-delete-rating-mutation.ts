import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRating } from "../api/ratings/delete-rating";

// 평점 삭제 Hook
export const useDeleteRatingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRating,

    onSuccess: () => {
      // 삭제된 평점이 목록에서 사라지도록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["ratings"],
      });

      alert("평점이 삭제되었습니다.");
    },

    onError: () => {
      alert("평점 삭제에 실패했습니다.");
    },
  });
};
