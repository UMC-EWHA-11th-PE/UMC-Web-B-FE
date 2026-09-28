import { Outlet } from '@tanstack/react-router';
import { Header } from './components/layout/header';

export default function App() {
  return <div className="flex min-h-screen flex-col bg-slate-50 text-[#20242c]">
    <Header />
    <Outlet />
    <footer className="mt-auto border-t border-gray-200 bg-white px-5 py-3 text-right text-xs text-slate-500">UMCine · 영화 탐색</footer>
  </div>;
}

