import { Link } from "@tanstack/react-router";
import { useQuery, useQueries } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { useFavoritesQuery } from "../../hooks/use-favorites-query";
import { movieQueries } from "../../api/movies/movie-queries";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../../components/bookmark-button";

export function MyPage() {
  // 로그인 상태 확인
  const accessToken = useAuthStore((state) => state.accessToken);

  // 현재 로그인한 회원 정보 조회
  const memberQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: !!accessToken,
  });

  // 서버에서 즐겨찾기 영화 목록 조회
  const favoritesQuery = useFavoritesQuery();

  const favorites = favoritesQuery.data ?? [];

  // 즐겨찾기 영화 ID를 이용해 TMDB 영화 상세 정보 조회
  // useQueries를 사용하면 여러 영화 정보를 동시에 요청할 수 있음
  const favoriteMovieQueries = useQueries({
    queries: favorites.map((favorite) => movieQueries.detail(favorite.movieId)),
  });

  const member = memberQuery.data;

  // 회원 정보 조회 중
  if (memberQuery.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p>회원 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  // 회원 정보 조회 실패
  if (memberQuery.isError || !member) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p>회원 정보를 불러오지 못했어요.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="mx-auto max-w-6xl px-6 py-10 text-left">
        {/* 마이페이지 제목 */}
        <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>

        <p className="mt-2 text-sm text-gray-500">
          내 정보와 즐겨찾기 영화를 확인할 수 있어요.
        </p>

        {/* 회원 프로필 영역 */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-5">
            {/* 기본 프로필 이미지 */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-10 w-10 text-gray-700"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2z" />
              </svg>
            </div>

            {/* 서버에서 조회한 회원 정보 */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {member.nickname}님
              </h2>
              <p className="mt-2 text-sm text-gray-500">{member.email}</p>
            </div>
          </div>

          {/* 내 정보 수정 페이지로 이동 */}
          <Link
            to="/my-info"
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-blue-700"
          >
            내 정보 수정
          </Link>
        </div>

        {/* 즐겨찾기 영화 목록 */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">즐겨찾기 영화</h2>

          <p className="mt-2 text-sm text-gray-500">
            내가 즐겨찾기에 추가한 영화들이에요.
          </p>

          {/* 즐겨찾기 목록 조회 중 */}
          {favoritesQuery.isPending && (
            <p className="mt-6 text-gray-500">
              즐겨찾기 목록을 불러오는 중이에요.
            </p>
          )}

          {/* 즐겨찾기 목록 조회 실패 */}
          {favoritesQuery.isError && (
            <div className="mt-6 rounded-xl bg-white p-8 text-center">
              <p className="text-gray-500">
                즐겨찾기 목록을 불러오지 못했어요.
              </p>

              <button
                type="button"
                onClick={() => favoritesQuery.refetch()}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* 즐겨찾기 영화가 없는 경우 */}
          {favoritesQuery.isSuccess && favorites.length === 0 && (
            <div className="mt-6 rounded-xl bg-white p-10 text-center">
              <p className="text-gray-500">
                아직 즐겨찾기에 추가한 영화가 없어요.
              </p>

              <Link
                to="/"
                className="mt-4 inline-block text-sm font-semibold text-blue-600"
              >
                영화 둘러보기
              </Link>
            </div>
          )}

          {/* 즐겨찾기 영화 카드 목록 */}
          {favoritesQuery.isSuccess && (
            <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {favoriteMovieQueries.map((query, index) => {
                const movie = query.data;
                const movieId = favorites[index].movieId;

                // 영화 상세 정보 조회 중
                if (query.isPending) {
                  return (
                    <div
                      key={movieId}
                      className="rounded-lg bg-white p-4 text-sm text-gray-500"
                    >
                      불러오는 중...
                    </div>
                  );
                }

                // 영화 상세 정보 조회 실패
                if (query.isError || !movie) {
                  return (
                    <div
                      key={movieId}
                      className="rounded-lg bg-white p-4 text-sm text-gray-500"
                    >
                      영화 정보를 불러오지 못했어요.
                    </div>
                  );
                }

                const posterUrl = getTmdbPosterUrl(movie.poster_path);

                return (
                  <article
                    key={movie.id}
                    className="relative overflow-hidden rounded-lg bg-white shadow-sm"
                  >
                    {/* 영화 상세 페이지로 이동 */}
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="block text-gray-900 no-underline"
                    >
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={`${movie.title} 포스터`}
                          className="aspect-[2/3] w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-[2/3] items-center justify-center bg-gray-200 text-sm text-gray-500">
                          이미지 없음
                        </div>
                      )}

                      <div className="p-3">
                        <h3 className="truncate text-sm font-semibold">
                          {movie.title}
                        </h3>
                      </div>
                    </Link>

                    {/* 즐겨찾기 등록 및 해제 버튼 */}
                    <div className="absolute right-2 top-2">
                      <BookmarkButton
                        movieId={movie.id}
                        movieTitle={movie.title}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
