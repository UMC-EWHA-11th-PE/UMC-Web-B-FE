
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRating } from "../api/ratings/update-rating";

export function useUpdateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ratingId,
      data,
    }: {
      ratingId: number;
      data: {
        movieId: number;
        score: number;
        comment: string;
      };
    }) => updateRating(ratingId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ratings"],
      });
    },
  });
}
