
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFavorite } from "../api/favorites/post-favorite";
import { deleteFavorite } from "../api/favorites/delete-favorite";

interface ToggleFavoriteParams {
  movieId: number;
  isBookmarked: boolean;
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, isBookmarked }: ToggleFavoriteParams) => {
      if (isBookmarked) {
        return deleteFavorite(movieId);
      }

      return postFavorite(movieId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });
}
