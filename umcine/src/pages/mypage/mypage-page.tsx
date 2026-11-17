
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { UserRound, ChevronLeft, ChevronRight } from "lucide-react";

import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { useAuthStore } from "../../stores/auth-store";
import { getMe } from "../../api/members/me";

const ITEMS_PER_PAGE = 3;

export function MyPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // 로그인 토큰 가져오기
  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  // 로그인한 회원 정보 조회
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 즐겨찾기 상태
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds
  );

  // TODO: 추후 TMDB API 데이터로 변경
  const bookmarkedMovies = movies.filter((movie) =>
    bookmarkedMovieIds.includes(movie.id)
  );

  const totalPages = Math.ceil(
    bookmarkedMovies.length / ITEMS_PER_PAGE
  );

  const currentMovies = bookmarkedMovies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="flex items-center justify-between border-b border-[#E2E5EA] pb-5">
          <h1 className="text-[28px] font-bold text-[#191B20]">
            내 정보
          </h1>

          <Link
            to="/mypage/edit"
            className="rounded-md bg-[#4B63E6] px-4 py-2 text-sm font-semibold text-white"
          >
            정보 수정
          </Link>
        </div>

        {/* 기본 정보 */}
        <section className="border-b border-[#E2E5EA] py-6">
          <h2 className="mb-5 text-base font-bold">
            기본 정보
          </h2>

          {meQuery.isPending ? (
            <p className="py-6 text-sm text-gray-400">
              회원 정보를 불러오는 중...
            </p>
          ) : meQuery.isError ? (
            <p className="py-6 text-sm text-red-500">
              회원 정보를 불러오지 못했습니다.
            </p>
          ) : (
            <div className="flex items-center gap-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E4E6EB]">
                <UserRound size={36} />
              </div>

              <div>
                <p className="mb-1 text-xs text-gray-400">
                  닉네임
                </p>
                <p className="text-sm font-semibold">
                  {meQuery.data.nickname}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs text-gray-400">
                  이메일
                </p>
                <p className="text-sm font-semibold">
                  {meQuery.data.email}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* 즐겨찾기 */}
        <section className="py-6">
          <h2 className="mb-5 text-base font-bold">
            내 즐겨찾기
          </h2>

          {bookmarkedMovies.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              아직 즐겨찾기한 영화가 없어요.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {currentMovies.map((movie) => (
                  <div key={movie.id}>
                    <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-200">
                      <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <h3 className="mt-2 text-sm font-semibold">
                      {movie.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      {movie.releaseDate}
                    </p>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => prev - 1)
                    }
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#191B20] text-sm text-white">
                    {currentPage}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => prev + 1)
                    }
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
