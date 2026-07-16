import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-[#171713] text-white">
      <div className="text-center">
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="display text-6xl font-semibold tracking-[-0.07em]">EraVault.</motion.p>
        <div className="mx-auto mt-7 h-px w-40 overflow-hidden bg-white/15">
          <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} className="h-full w-1/2 bg-[#d8ff45]" />
        </div>
        <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.25em] text-white/35">Opening the archive</p>
      </div>
    </div>
  );
}