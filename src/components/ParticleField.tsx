import { useMemo } from 'react';
export default function ParticleField() {
  const pts = useMemo(() => Array.from({ length:80 }, (_, i) => ({
    i, s: Math.random()*3+.5, x: Math.random()*100, y: Math.random()*100,
    dur: Math.random()*20+12, del: Math.random()*12,
    col: ['212,168,83','124,58,237','34,211,238','236,72,153'][Math.floor(Math.random()*4)],
    op: Math.random()*.4+.15,
  })), []);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {pts.map(p => (
        <div key={p.i} className="particle" style={{
          width:p.s, height:p.s, left:`${p.x}%`, top:`${p.y}%`,
          background:`rgba(${p.col},${p.op})`,
          boxShadow:`0 0 ${p.s*6}px rgba(${p.col},.25)`,
          animationDuration:`${p.dur}s`, animationDelay:`${p.del}s`,
        }} />
      ))}
    </div>
  );
}
