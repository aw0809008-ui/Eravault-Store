export default function ContactSection() {
  const contacts = [
    {
      icon: (<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/><circle cx="12" cy="12" r="3.5"/></svg>),
      title: 'Instagram', subtitle: '@Eravault_vintage',
      href: 'https://instagram.com/Eravault_vintage',
      gradient: 'from-[#833AB4] via-[#E1306C] to-[#F77737]',
      hoverGlow: 'hover:shadow-pink-500/30',
    },
    {
      icon: (<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>),
      title: 'Email', subtitle: 'eravaultvintage@gmail.com',
      href: 'mailto:eravaultvintage@gmail.com',
      gradient: 'from-brand-500 to-brand-700',
      hoverGlow: 'hover:shadow-brand-500/30',
    },
  ];

  return (
    <section id="contact" className="py-12 sm:py-20 md:py-32 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 40%, #1a1a2e 70%, #16213e 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.12) 0%, transparent 60%)' }} />
        <div className="absolute -bottom-40 -right-32 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(196,154,98,0.08) 0%, transparent 55%)' }} />
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(196,154,98,0.4) 50%, transparent 90%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-bold uppercase tracking-wider rounded-full mb-4">Get In Touch</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">Contact <span className="gradient-text">Us</span></h2>
          <p className="text-white/60 max-w-xl mx-auto text-sm sm:text-lg">Reach out through Instagram or Email. We'd love to hear from you.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {contacts.map((contact, i) => (
            <a key={i} href={contact.href} target="_blank" rel="noopener noreferrer"
              className={`group glass-dark rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${contact.hoverGlow}`}>
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${contact.gradient} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                {contact.icon}
              </div>
              <h3 className="font-bold text-xl mb-2">{contact.title}</h3>
              <p className="text-white/60">{contact.subtitle}</p>
            </a>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span className="text-sm font-medium">Secure Shopping</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span className="text-sm font-medium">Verified Authentic</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🌍</span>
            <span className="text-sm font-medium">Worldwide Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
}
