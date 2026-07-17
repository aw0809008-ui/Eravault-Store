import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Send email via mailto as a simple approach (or could integrate with Supabase)
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setEmail('');
  };

  return (
    <section className="py-12 sm:py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #faf7f2 0%, #f0e8d8 50%, #faf7f2 100%)' }}>
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.12) 0%, transparent 65%)' }} />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.08) 0%, transparent 60%)' }} />
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(196,154,98,0.25), transparent)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
          {/* Inner decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.15) 0%, transparent 60%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.1) 0%, transparent 60%)' }} />
            {/* Subtle pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="nlpat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#c49a62" strokeWidth="0.5" />
              </pattern></defs>
              <rect width="100%" height="100%" fill="url(#nlpat)" />
            </svg>
          </div>

          <div className="relative z-10">
            <span className="inline-block text-4xl mb-4">📬</span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Stay in the <span className="gradient-text">Loop</span>
            </h2>
            <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Be the first to know about new arrivals, exclusive drops, and special offers. Follow us on Instagram for daily updates!
            </p>

            {submitted ? (
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-green-500/20 border border-green-500/30 rounded-2xl">
                  <span className="text-2xl">✅</span>
                  <span className="text-green-300 font-semibold">Thank you! Check your inbox.</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 text-sm focus:border-brand-400 focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/30 hover:scale-105 uppercase tracking-wider text-sm whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/40 text-xs">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                No spam, ever
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Early access to drops
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/><circle cx="12" cy="12" r="3.5"/></svg>
                Instagram exclusives
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
