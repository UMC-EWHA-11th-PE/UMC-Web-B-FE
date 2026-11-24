"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/app/store/auth-store";

import {
  bookmarkOwner,
  initializeBookmarks,
  useBookmarkStore,
} from "@/app/store/bookmark-store";

type BookmarkButtonProps = {
  movieId: number;
  title: string;
  compact?: boolean;
};

export function BookmarkButton({
  movieId,
  title,
  compact = false,
}: BookmarkButtonProps) {
  const token = useAuthStore((state) => state.accessToken);
  const owner = bookmarkOwner(token);
  const ready = useBookmarkStore((state) => state.ready);
  const isBookmarked = useBookmarkStore(
    (state) => state.byMember[owner]?.includes(movieId) ?? false,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    void initializeBookmarks();
  }, []);

  return (
    <button
      type="button"
      disabled={!ready}
      aria-label={`${title} 즐겨찾기`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={[
        "rounded-md font-bold text-white disabled:opacity-50",
        isBookmarked ? "bg-blue-600" : "bg-slate-800",
        compact ? "grid size-9 place-items-center text-lg" : "px-3 py-2 text-sm",
      ].join(" ")}
    >
      {compact ? (
        <span aria-hidden="true">{isBookmarked ? "★" : "☆"}</span>
      ) : (
        <span aria-hidden="true">
          {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        </span>
      )}
    </button>
  );
}