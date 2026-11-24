"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";

import { BookmarkButton } from "../components/bookmark-button";
import type { TmdbMovieDetail } from "../movies/models";
import { readToken } from "../session";
import { useAuthStore } from "../store/auth-store";
import { initializeBookmarks, useBookmarkStore } from "../store/bookmark-store";
import { useProfileStore } from "../store/profile-store";

type MovieSummary = Pick<
  TmdbMovieDetail,
  "id" | "title" | "poster_path" | "release_date"
>;

const PAGE_SIZE = 5;
const EMPTY_IDS: number[] = [];

export default function MyPage() {
  const token = useAuthStore((state) => state.accessToken);
  const member = readToken(token);

  if (!member) {
    return (
      <main className="mx-auto w-full max-w-[1240px] flex-1 px-5 py-10">
        <h1 className="mb-4 text-2xl font-bold">내 정보</h1>
        <Link href="/login" className="text-blue-600 underline">
          로그인하고 내 정보를 확인하세요.
        </Link>
      </main>
    );
  }

  return <MemberPage key={member.sub} memberId={member.sub} email={member.email} />;
}

function MemberPage({ memberId, email }: { memberId: string; email: string }) {
  const profile = useProfileStore((state) => state.profile);
  const ready = useBookmarkStore((state) => state.ready);
  const movieIds = useBookmarkStore(
    (state) => state.byMember[memberId] ?? EMPTY_IDS,
  );
  const [requestedPage, setRequestedPage] = useState(1);

  useEffect(() => {
    void initializeBookmarks();
  }, []);

  const totalPages = Math.max(1, Math.ceil(movieIds.length / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const visibleIds = movieIds.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const movieQueries = useQueries({
    queries: visibleIds.map((id) => ({
      queryKey: ["movies", "summary", id],
      queryFn: ({ signal }: { signal: AbortSignal }) => getMovieSummary(id, signal),
      staleTime: 5 * 60 * 1000,
      retry: false,
    })),
  });

  return (
    <main className="mx-auto w-full max-w-[1240px] flex-1 px-5 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">내 정보</h1>
        <Link href="/mypage-edit" className="rounded bg-blue-600 px-4 py-2 text-sm text-white">
          정보 수정
        </Link>
      </div>

      <dl className="grid gap-4 border-y border-slate-200 py-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-slate-500">닉네임</dt>
          <dd className="font-bold">
            {profile?.email === email ? profile.nickname : "닉네임 정보 없음"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">이메일</dt>
          <dd className="break-all font-bold">{email}</dd>
        </div>
      </dl>

      <section className="mt-6">
        <h2 className="mb-4 text-lg font-bold">내 즐겨찾기</h2>

        {!ready ? (
          <p role="status">즐겨찾기를 불러오는 중이에요.</p>
        ) : movieIds.length === 0 ? (
          <p className="text-sm text-slate-500">즐겨찾기한 영화가 없어요.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {movieQueries.map((query, index) => {
              const id = visibleIds[index];

              if (query.isPending) {
                return <li key={id} role="status">불러오는 중이에요.</li>;
              }

              if (query.isError) {
                return (
                  <li key={id} className="space-y-2">
                    <p className="text-sm">영화 정보를 불러오지 못했어요.</p>
                    <button
                      type="button"
                      onClick={() => void query.refetch()}
                      className="block text-sm text-blue-600 underline"
                    >
                      다시 시도
                    </button>
                    <BookmarkButton movieId={id} title={`영화 ${id}`} />
                  </li>
                );
              }

              const movie = query.data;

              return (
                <li key={id} className="min-w-0 space-y-2">
                  <Link href={`/movies/${id}`} className="block">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-slate-100">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt=""
                          fill
                          sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 230px"
                          className="object-cover"
                        />
                      ) : (
                        <p className="grid h-full place-items-center text-xs text-slate-500">
                          포스터 없음
                        </p>
                      )}
                    </div>
                    <h3 className="mt-2 truncate text-sm font-bold">{movie.title}</h3>
                  </Link>
                  <p className="text-xs text-slate-500">
                    {movie.release_date || "개봉일 정보 없음"}
                  </p>
                  <BookmarkButton movieId={id} title={movie.title} />
                </li>
              );
            })}
          </ul>
        )}

        {totalPages > 1 && (
          <nav aria-label="즐겨찾기 페이지 이동" className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setRequestedPage(page - 1)}
              className="rounded border px-3 py-1 disabled:opacity-40"
            >
              이전
            </button>
            <span className="py-1 text-sm">{page} / {totalPages}</span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setRequestedPage(page + 1)}
              className="rounded border px-3 py-1 disabled:opacity-40"
            >
              다음
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}

async function getMovieSummary(id: number, signal: AbortSignal): Promise<MovieSummary> {
  const response = await fetch(`/movies/${id}/summary`, { signal });

  if (!response.ok) {
    throw new Error("영화 정보를 불러오지 못했어요.");
  }

  return response.json();
}