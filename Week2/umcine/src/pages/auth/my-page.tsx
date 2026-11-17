//영화 상세 api로 즐겨찾기 목록 표시
import { useAuthStore } from "@/stores/auth-store";
import { readToken } from "@/api/session";
import { useState } from "react";
import { useUpdateMeMutation } from "@/hooks/use-update-me-mutation";
import { Link } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useProfileStore } from "@/stores/profile-store";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";
import { getFavorites } from "@/api/favorites/favorites";


const PAGE_SIZE = 5;

export function MyPage() {
  const token = useAuthStore(state => state.accessToken);
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const updateMeMutation = useUpdateMeMutation();
  const [nicknameDraft, setNicknameDraft] = useState<string | null>(null);
  const nickname = nicknameDraft?.trim() ?? "";
  const isNicknameValid = nickname.length >= 2 && nickname.length <= 12;
  const isUnchanged = nickname === profile.nickname;
  const canSaveNickname =
    isNicknameValid && !isUnchanged && !updateMeMutation.isPending;

  const handleSaveNickname = () => {
    if (!canSaveNickname) return;

    updateMeMutation.mutate(
      { nickname },
      {
        onSuccess: ({ result }) => {
          updateProfile({
            email: result.email,
            nickname: result.nickname,
            image: profile.image,
          });
          setNicknameDraft(null);
        },
      },
    );
  };

  const memberId = readToken(token)?.sub;
  const favoritesQuery = useQuery({
    queryKey: ["favorites", memberId, "list"],
    queryFn: getFavorites,
    enabled: Boolean(memberId),
  });

  const movieIds = favoritesQuery.data?.map(({ movieId }) => movieId) ?? [];
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

  if (!memberId) {
    return (
      <main className="p-10">
        <Link to="/login">로그인이 필요해요. 로그인하기</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1240px] flex-1 px-5 pb-16 pt-7">
      <div className="mb-7 flex items-center justify-between gap-4">
        <h1 className="text-[28px] font-extrabold">내 정보</h1>

        {nicknameDraft === null && (
          <button
            type="button"
            onClick={() => setNicknameDraft(profile.nickname)}
            className="rounded-md bg-blue-600 px-4 py-3 text-xs font-bold text-white hover:bg-blue-700"
          >
            정보 수정
          </button>
        )}
      </div>

      <section className="border-y border-slate-200 py-4">
        <h2 className="mb-4 text-sm font-bold">기본 정보</h2>

        {nicknameDraft !== null && (
          <div className="mb-4" aria-busy={updateMeMutation.isPending}>
            <label htmlFor="mypage-nickname" className="mb-2 block text-xs font-bold">
              새 닉네임
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                id="mypage-nickname"
                autoComplete="nickname"
                value={nicknameDraft}
                onChange={(event) => setNicknameDraft(event.target.value)}
                disabled={updateMeMutation.isPending}
                aria-describedby="mypage-nickname-help"
                className="rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleSaveNickname}
                disabled={!canSaveNickname}
                className="rounded-md bg-blue-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
              >
                {updateMeMutation.isPending ? "저장 중" : "저장"}
              </button>
              <button
                type="button"
                onClick={() => setNicknameDraft(null)}
                disabled={updateMeMutation.isPending}
                className="rounded-md border border-slate-200 px-4 py-2 text-xs disabled:opacity-50"
              >
                취소
              </button>
            </div>
            <p id="mypage-nickname-help" className="mt-2 text-xs text-slate-500">
              닉네임은 2~12자로 입력해 주세요.
            </p>
          </div>
        )}

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

        {favoritesQuery.isPending ? (
          <p role="status" className="py-10 text-sm text-slate-500">
            즐겨찾기를 불러오는 중이에요.
          </p>
        ) : favoritesQuery.isError ? (
          <div className="py-10 text-sm">
            <p role="alert">즐겨찾기를 불러오지 못했어요.</p>
            <button
              type="button"
              onClick={() => void favoritesQuery.refetch()}
              className="mt-2 text-blue-600"
            >
              다시 시도
            </button>
          </div>
        ) : movieIds.length === 0 ? (
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