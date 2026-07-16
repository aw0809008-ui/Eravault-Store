import { useState } from 'react';

export default function AnnouncementBar() {
  const [closed, setClosed] = useState(false);
  if (closed) return null;

  return (
    <div className="bg-brand-900 text-white text-xs sm:text-sm relative overflow-hidden z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex-1 overflow-hidden">
          <div className="whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }}>
            <span className="mx-8">🌍 Worldwide Shipping Available</span>
            <span className="mx-8">✨ 100% Authentic Vintage Pieces</span>
            <span className="mx-8">💬 WhatsApp: +92 323 8226427</span>
            <span className="mx-8">📸 Follow @Eravault_vintage on Instagram</span>
            <span className="mx-8">🌍 Worldwide Shipping Available</span>
            <span className="mx-8">✨ 100% Authentic Vintage Pieces</span>
          </div>
        </div>
        <button onClick={() => setClosed(true)} className="ml-3 text-white/60 hover:text-white flex-shrink-0 p-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
