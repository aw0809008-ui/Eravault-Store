import { useState, useEffect, useRef } from 'react';
import { getOrCreateChat, sendMessage, getMessages, markRead, subscribeToMessages, type ChatMessage } from '../lib/supabase';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'intro' | 'chat'>('intro');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [chatId, setChatId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottom = useRef<HTMLDivElement>(null);

  // Load saved session
  useEffect(() => {
    const saved = localStorage.getItem('ev_chat');
    if (saved) {
      const { name: n, email: e, chatId: c } = JSON.parse(saved);
      setName(n); setEmail(e); setChatId(c); setStep('chat');
    }
  }, []);

  // Load messages + subscribe
  useEffect(() => {
    if (!chatId) return;
    getMessages(chatId).then(setMessages);
    const channel = subscribeToMessages(chatId, (msg) => {
      setMessages(prev => [...prev, msg]);
      if (!open && msg.sender === 'admin') setUnread(u => u + 1);
    });
    return () => { channel.unsubscribe(); };
  }, [chatId, open]);

  // Scroll to bottom
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const startChat = async () => {
    if (!name.trim() || !email.trim()) return;
    const id = await getOrCreateChat(name.trim(), email.trim());
    setChatId(id);
    setStep('chat');
    localStorage.setItem('ev_chat', JSON.stringify({ name, email, chatId: id }));
    getMessages(id).then(setMessages);
  };

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    await sendMessage(chatId, 'buyer', text.trim());
    setText('');
    setSending(false);
    getMessages(chatId).then(setMessages);
  };

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
    if (chatId) markRead(chatId, 'buyer');
  };

  return (
    <>
      {/* Float Button */}
      <button onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center shadow-xl shadow-brand-500/30 transition-all hover:scale-110 active:scale-95">
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        {unread > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">{unread}</span>}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-brand-200 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">E</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">EraVault Chat</p>
                <p className="text-white/60 text-[10px]">🔒 End-to-end encrypted</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {step === 'intro' ? (
            /* Intro Form */
            <div className="p-5 space-y-4">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                  <svg className="w-7 h-7 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <h3 className="font-bold text-brand-950 text-lg">Chat with us!</h3>
                <p className="text-brand-500 text-xs mt-1">Messages are encrypted. Only you and EraVault can read them.</p>
              </div>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-3 border-2 border-brand-200 rounded-xl text-sm focus:border-brand-500" />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" type="email" className="w-full px-4 py-3 border-2 border-brand-200 rounded-xl text-sm focus:border-brand-500" />
              <button onClick={startChat} disabled={!name.trim() || !email.trim()}
                className="w-full py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-xl disabled:opacity-50 transition-all hover:shadow-lg text-sm">
                Start Chat
              </button>
            </div>
          ) : (
            /* Chat Messages */
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[45vh] bg-brand-50/50">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-brand-400 text-sm">
                    <p>👋 Hi {name}!</p>
                    <p className="text-xs mt-1">Send a message to start the conversation.</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${m.sender === 'buyer' ? 'bg-brand-600 text-white rounded-br-md' : 'bg-white text-brand-900 border border-brand-100 rounded-bl-md shadow-sm'}`}>
                      <p className="break-words">{m.message}</p>
                      <p className={`text-[9px] mt-1 ${m.sender === 'buyer' ? 'text-white/50' : 'text-brand-400'}`}>
                        {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottom} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-brand-100 flex gap-2 flex-shrink-0 bg-white">
                <input value={text} onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Type a message..." className="flex-1 px-4 py-2.5 bg-brand-50 border border-brand-200 rounded-xl text-sm focus:border-brand-500" />
                <button onClick={send} disabled={!text.trim() || sending}
                  className="w-10 h-10 bg-brand-600 hover:bg-brand-700 text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-all flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>

              <div className="px-3 pb-2 flex items-center justify-center gap-1.5 text-[9px] text-brand-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                End-to-end encrypted
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
