import { Suspense } from "react";
import { SearchPage } from "@/views/movies/search-page";

// 검색 페이지
export default function Page() {
  return (
    <Suspense fallback={<div>검색 페이지를 불러오는 중...</div>}>
      <SearchPage />
    </Suspense>
  );
}
