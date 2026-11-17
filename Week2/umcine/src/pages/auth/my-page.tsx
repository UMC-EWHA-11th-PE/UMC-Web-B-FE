//기존 북마크 저장소에서 영화 id 가져오기
//영화 상세 api로 즐겨찾기 목록 표시
import { useAuthStore } from "@/stores/auth-store";
import { readToken } from "@/api/session";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useProfileStore } from "@/stores/profile-store";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";

const PAGE_SIZE = 5;

export function MyPage() {
  const token = useAuthStore(state => state.accessToken);
  const profile = useProfileStore((state) => state.profile);
  const movieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [requestedPage, setRequestedPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(movieIds.length / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const visibleIds = movieIds.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const movieQueries = useQueries({
    queries: visibleIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
    })),
  });

  if (!readToken(token)) return <main className="p-10"><Link to="/login">로그인이 필요해요. 로그인하기</Link></main>;

  return (
    <main className="mx-auto w-full max-w-[1240px] flex-1 px-5 pb-16 pt-7">
      <div className="mb-7 flex items-center justify-between gap-4">
        <h1 className="text-[28px] font-extrabold">내 정보</h1>

        <Link
          to="/mypage-edit"
          className="rounded-md bg-blue-600 px-4 py-3 text-xs font-bold text-white hover:bg-blue-700"
        >
          정보 수정
        </Link>
      </div>

      <section className="border-y border-slate-200 py-4">
        <h2 className="mb-4 text-sm font-bold">기본 정보</h2>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex size-[76px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200">
            <img
              src={profile.image || "/icons/person.svg"}
              alt="프로필"
              className={
                profile.image
                  ? "size-full object-cover"
                  : "size-10 object-contain"
              }
            />
          </div>

          <dl className="grid min-w-0 flex-1 gap-5 sm:grid-cols-2">
            <div>
              <dt className="mb-1 text-[11px] text-slate-400">
                닉네임
              </dt>
              <dd className="break-all text-sm font-bold">
                {profile.nickname}
              </dd>
            </div>

            <div>
              <dt className="mb-1 text-[11px] text-slate-400">
                이메일
              </dt>
              <dd className="break-all text-sm font-bold">
                {profile.email}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="pt-6">
        <h2 className="mb-4 text-sm font-bold">내 즐겨찾기</h2>

        {movieIds.length === 0 ? (
          <p className="py-20 text-center text-sm text-slate-500">
            즐겨찾기한 영화가 없어요.
            <br />
            영화 카드의 북마크를 눌러 추가해 보세요.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 min-[521px]:grid-cols-3 min-[801px]:grid-cols-5">
              {movieQueries.map((query, index) => {
                if (query.isPending) {
                  if (!readToken(token)) return <main className="p-10"><Link to="/login">로그인이 필요해요. 로그인하기</Link></main>;

  return (
                    <div key={visibleIds[index]} role="status">
                      <div className="aspect-[0.88] animate-pulse rounded-lg bg-slate-200" />
                      <p className="mt-2 text-xs text-slate-500">
                        불러오는 중이에요.
                      </p>
                    </div>
                  );
                }

                if (query.isError) {
                  if (!readToken(token)) return <main className="p-10"><Link to="/login">로그인이 필요해요. 로그인하기</Link></main>;

  return (
                    <div key={visibleIds[index]} className="py-8 text-sm">
                      <p role="alert">영화를 불러오지 못했어요.</p>
                      <button
                        type="button"
                        onClick={() => void query.refetch()}
                        className="mt-3 cursor-pointer text-blue-600"
                      >
                        다시 시도
                      </button>
                    </div>
                  );
                }

                const movie = query.data;
                const posterUrl = getTmdbPosterUrl(movie.poster_path);

                if (!readToken(token)) return <main className="p-10"><Link to="/login">로그인이 필요해요. 로그인하기</Link></main>;

  return (
                  <article key={movie.id} className="min-w-0">
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="block overflow-hidden rounded-lg"
                    >
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={`${movie.title} 포스터`}
                          className="aspect-[0.88] w-full object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="flex aspect-[0.88] items-center justify-center bg-slate-200 text-xs text-slate-500">
                          포스터 없음
                        </div>
                      )}
                    </Link>

                    <h3 className="mt-2 truncate text-sm font-bold">
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                      >
                        {movie.title}
                      </Link>
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      {movie.release_date
                        ? movie.release_date.replaceAll("-", ".")
                        : "개봉일 정보 없음"}
                    </p>
                  </article>
                );
              })}
            </div>

            <nav
              aria-label="즐겨찾기 페이지"
              className="mt-8 flex items-center justify-center gap-3"
            >
              <button
                type="button"
                aria-label="이전 페이지"
                disabled={page === 1}
                onClick={() => setRequestedPage(page - 1)}
                className="cursor-pointer p-2 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <img
                  src="/icons/chevron-left.svg"
                  alt=""
                  className="size-4"
                />
              </button>

              <span
                aria-current="page"
                aria-label={`${totalPages}페이지 중 ${page}페이지`}
                className="rounded-md bg-[#20242c] px-4 py-2 text-xs font-bold text-white"
              >
                {page}
              </span>

              <button
                type="button"
                aria-label="다음 페이지"
                disabled={page === totalPages}
                onClick={() => setRequestedPage(page + 1)}
                className="cursor-pointer p-2 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <img
                  src="/icons/chevron-right.svg"
                  alt=""
                  className="size-4"
                />
              </button>
            </nav>
          </>
        )}
      </section>
    </main>
  );
}