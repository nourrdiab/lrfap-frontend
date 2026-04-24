import { Outlet } from 'react-router-dom';
import { PublicNavBar } from '../components/public/PublicNavBar';
import { PublicFooter } from '../components/public/PublicFooter';
import { ChatbotWidget } from '../components/chatbot/ChatbotWidget';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <PublicNavBar variant="solid" />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <ChatbotWidget />
    </div>
  );
}
