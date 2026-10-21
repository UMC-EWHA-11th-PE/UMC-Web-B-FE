import { Outlet } from '@tanstack/react-router';
import { Header } from './components/layout/header';
import Footer from './components/layout/footer';

export default function App() {
  return <div className="flex min-h-screen flex-col bg-slate-50 text-[#20242c]">
    <Header />
    <Outlet />
    <Footer />
  </div>;
}

