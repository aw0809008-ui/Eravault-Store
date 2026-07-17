import { useState } from 'react';

interface Props { onClose: () => void; }

export default function AdminDashboard({ onClose }: Props) {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);

  const handleLogin = () => {
    if (password === 'eravault2024') setAuthed(true);
  };

  if (!authed) {
    return (
      <div className="fixed inset-0 z-[200] bg-brand-950 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-sm border border-white/20">
          <h2 className="text-2xl font-display font-bold text-white mb-6 text-center">Admin Login</h2>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="Password" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 mb-4" />
          <button onClick={handleLogin} className="w-full py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-xl">Login</button>
          <button onClick={onClose} className="w-full py-3 text-white/60 mt-2">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-brand-950 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-white">Admin Dashboard</h1>
          <button onClick={onClose} className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all">Close</button>
        </div>
        <p className="text-white/60">Admin dashboard is active. For full admin features, please access the complete version.</p>
      </div>
    </div>
  );
}
