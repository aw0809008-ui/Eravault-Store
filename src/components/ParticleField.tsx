import { useMemo } from 'react';

export default function ParticleField() {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      color: ['rgba(245,166,35,', 'rgba(168,85,247,', 'rgba(6,182,212,', 'rgba(236,72,153,'][Math.floor(Math.random() * 4)],
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `${p.color}${p.opacity})`,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}0.3)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
