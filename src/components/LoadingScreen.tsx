import { motion } from 'framer-motion';
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#020008] flex items-center justify-center z-[999]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--gold)]/[.03] rounded-full blur-3xl" />
      </div>
      <div className="relative text-center">
        <div className="cube-wrap w-20 h-20 mx-auto mb-10">
          <motion.div animate={{ rotateX:[0,360], rotateY:[0,360] }} transition={{ duration:4, repeat:Infinity, ease:'linear' }}
            className="w-full h-full relative" style={{ transformStyle:'preserve-3d' }}>
            {['rotateY(0deg) translateZ(40px)','rotateY(90deg) translateZ(40px)','rotateY(180deg) translateZ(40px)','rotateY(270deg) translateZ(40px)','rotateX(90deg) translateZ(40px)','rotateX(-90deg) translateZ(40px)'].map((tr,i) => (
              <div key={i} className="absolute inset-0 border border-[var(--gold)]/15 bg-[var(--gold)]/[.03]" style={{ transform:tr }} />
            ))}
          </motion.div>
        </div>
        <h2 className="text-3xl font-black mb-1" style={{ fontFamily:"'Playfair Display',serif" }}>
          <span className="text-gradient-gold">Era</span><span className="text-white">Vault</span>
        </h2>
        <p className="text-[9px] tracking-[.4em] uppercase text-white/20" style={{ fontFamily:"'Orbitron',sans-serif" }}>Loading Treasures</p>
        <div className="mt-10 w-48 h-[2px] mx-auto rounded-full bg-white/5 overflow-hidden">
          <motion.div animate={{ x:['-100%','200%'] }} transition={{ duration:1.5, repeat:Infinity, ease:'easeInOut' }}
            className="w-1/3 h-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
        </div>
      </div>
    </div>
  );
}
