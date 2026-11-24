import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../api/favorites/get-favorites";

export function useGetFavoritesQuery() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });
}