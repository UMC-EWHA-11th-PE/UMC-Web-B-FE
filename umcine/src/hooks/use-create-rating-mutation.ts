import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";

// 평점 등록 Hook
export const useCreateRatingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,

    onSuccess: () => {
      // 평점 등록 후 기존 평점 목록 다시 조회
      queryClient.invalidateQueries({
        queryKey: ["ratings"],
      });

      alert("평점이 등록되었습니다.");
    },

    onError: () => {
      alert("평점 등록에 실패했습니다.");
    },
  });
};
