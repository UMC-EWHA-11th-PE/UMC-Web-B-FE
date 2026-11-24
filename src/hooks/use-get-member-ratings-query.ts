
import { useQuery } from "@tanstack/react-query";
import { getMemberRatings } from "../api/ratings/get-member-ratings";

export function useGetMemberRatingsQuery() {
  return useQuery({
    queryKey: ["ratings"],
    queryFn: getMemberRatings,
  });
}
