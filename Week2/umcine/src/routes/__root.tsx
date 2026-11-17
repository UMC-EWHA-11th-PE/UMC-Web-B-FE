import { createRootRoute, Link } from '@tanstack/react-router';
import App from '../app';
export const Route = createRootRoute({
  component: App,
  notFoundComponent: () => <main className="mx-auto w-full max-w-[1320px] flex-1 px-5 py-20"><h1 className="mb-4 text-2xl font-bold">페이지를 찾을 수 없어요.</h1><Link to="/" className="text-blue-600 underline">영화 목록으로 돌아가기</Link></main>,
});

