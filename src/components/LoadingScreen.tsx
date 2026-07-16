import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#030014] flex items-center justify-center z-[999]">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center">
        {/* 3D rotating cube */}
        <div className="w-20 h-20 mx-auto mb-10 relative" style={{ perspective: '600px' }}>
          <motion.div
            animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {[
              'rotateY(0deg) translateZ(40px)',
              'rotateY(90deg) translateZ(40px)',
              'rotateY(180deg) translateZ(40px)',
              'rotateY(270deg) translateZ(40px)',
              'rotateX(90deg) translateZ(40px)',
              'rotateX(-90deg) translateZ(40px)',
            ].map((transform, i) => (
              <div
                key={i}
                className="absolute inset-0 border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-purple-500/5 backdrop-blur-sm"
                style={{ transform }}
              />
            ))}
          </motion.div>
        </div>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-black mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">Era</span>
            <span className="text-white">Vault</span>
          </h2>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Loading Treasures
          </p>
        </motion.div>

        {/* Loading bar */}
        <div className="mt-10 w-56 h-[2px] mx-auto rounded-full bg-white/5 overflow-hidden">
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1/3 h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
