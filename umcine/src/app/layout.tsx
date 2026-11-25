import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Providers from "./providers";
import "../index.css";

// 서비스 메타데이터 설정
export const metadata: Metadata = {
  title: "UMCine",
  description: "영화를 검색하고 평점과 즐겨찾기를 관리하는 서비스",
};

// 모든 페이지의 공통 틀
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          {/* 기존 Vite 프로젝트의 화면 너비 및 CSS 설정 유지 */}
          <div id="root">
            {/* Header는 모든 페이지에서 항상 표시 */}
            <Header />

            {/* 현재 URL에 맞는 페이지가 표시되는 자리 */}
            {children}

            {/* Footer는 모든 페이지의 하단에 표시 */}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
