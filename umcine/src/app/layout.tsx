import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../index.css";
import { Providers } from "./providers";
import { Header } from "../components/layout/header";
import Footer from "../components/layout/footer";

export const metadata: Metadata = {
  title: "umcine",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
