//모든 페이지의 공통 틀

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      {/* Header는 모든 페이지에서 항상 표시 */}
      <Header />
      {/* 현재 URL에 맞는 페이지가 표시되는 자리 */}
      <Outlet /> /
    </>
  ), 
  //존재하지 않는 URL에 접근하면 보이는 페이지
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});