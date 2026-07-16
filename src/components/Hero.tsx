import { motion } from 'framer-motion';
import { ArrowDownRight, MessageCircle } from 'lucide-react';
import { MEDIA, getWhatsAppUrl } from '../lib/store';

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[760px] overflow-hidden bg-[#171713] text-white lg:min-h-screen">
      <div className="absolute inset-0">
        <img src={MEDIA.hero} alt="Vintage clothing arranged in the EraVault archive" className="hero-image h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/42 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
      </div>

      <div className="relative mx-auto flex min-h-[760px] max-w-[1500px] items-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:min-h-screen lg:px-12 lg:pb-24">
        <div className="max-w-5xl" style={{ perspective: '1000px' }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-white/75">
            Curated vintage clothing / UK
          </motion.p>
          <h1 className="display max-w-5xl text-[clamp(5.4rem,14vw,13rem)] font-semibold leading-[0.72] tracking-[-0.085em]">
            <span className="word-reveal block">Era</span>
            <span className="word-reveal ml-[0.34em] block italic" style={{ animationDelay: '120ms' }}>Vault.</span>
          </h1>
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.7 }} className="mt-10 flex max-w-3xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-base leading-7 text-white/78 sm:text-lg">
              One-off denim, outerwear, tees and knitwear, handpicked for character and built for another lifetime.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#collection" className="focus-ring inline-flex items-center gap-3 bg-[#d8ff45] px-6 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#171713] transition-transform hover:-translate-y-1">
                Shop the drop <ArrowDownRight className="h-4 w-4" />
              </a>
              <a href={getWhatsAppUrl()} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-3 border border-white/40 px-6 py-4 text-xs font-extrabold uppercase tracking-[0.16em] transition-colors hover:bg-white hover:text-[#171713]">
                Ask us <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}