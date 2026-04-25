import { Outlet, useLocation } from 'react-router-dom';
import { PublicNavBar } from '../components/public/PublicNavBar';
import { PublicFooter } from '../components/public/PublicFooter';
import { ChatbotWidget } from '../components/chatbot/ChatbotWidget';

export function PublicLayout() {
  const { pathname } = useLocation();
  const navVariant =
    pathname === '/programs' || pathname === '/terms' ? 'white' : 'solid';
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <PublicNavBar variant={navVariant} />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <ChatbotWidget />
    </div>
  );
}
