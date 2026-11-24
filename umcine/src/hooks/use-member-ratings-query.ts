import { useQuery } from "@tanstack/react-query";
import { getMemberRatings } from "../api/ratings/get-member-ratings";

// 특정 회원의 평점 목록을 조회하는 Hook
export const useMemberRatingsQuery = (memberId: number) => {
  return useQuery({
    queryKey: ["ratings", "member", memberId],
    queryFn: () => getMemberRatings(memberId),

    // 유효한 회원 ID가 있을 때만 요청
    enabled: memberId > 0,
    staleTime: 5 * 60 * 1000,
  });
};
