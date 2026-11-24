
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFavorite } from "../api/favorites/post-favorite";

export function usePostFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });
}
