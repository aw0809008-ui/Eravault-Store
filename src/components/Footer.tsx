import { ArrowUpRight, ExternalLink, MessageCircle } from 'lucide-react';
import { STORE, getWhatsAppUrl } from '../lib/store';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#171713] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-14 border-b border-white/15 pb-16 lg:grid-cols-[1.5fr_0.6fr_0.6fr_0.8fr]">
          <div>
            <p className="display text-6xl font-semibold tracking-[-0.07em] sm:text-8xl">EraVault.</p>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/55">Curated one-off vintage clothing. Every piece is inspected, photographed and listed by the EraVault team.</p>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40">Explore</p>
            <div className="space-y-3 text-sm">
              <a href="#collection" className="block hover:text-[#d8ff45]">Latest drop</a>
              <a href="#story" className="block hover:text-[#d8ff45]">Our story</a>
              <a href="#how-it-works" className="block hover:text-[#d8ff45]">How it works</a>
              <a href="#faq" className="block hover:text-[#d8ff45]">FAQ</a>
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40">Policies</p>
            <div className="space-y-3 text-sm text-white/70">
              <p>Condition guide</p>
              <p>Tracked shipping</p>
              <p>Returns by enquiry</p>
              <p>Privacy</p>
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40">Talk to us</p>
            <a href={getWhatsAppUrl()} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-white/25 py-3 text-sm hover:border-[#d8ff45] hover:text-[#d8ff45]">
              WhatsApp <MessageCircle className="h-4 w-4" />
            </a>
            <a href={`mailto:${STORE.email}`} className="group flex items-center justify-between border-b border-white/25 py-3 text-sm hover:border-[#d8ff45] hover:text-[#d8ff45]">
              Email <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={STORE.instagram} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-white/25 py-3 text-sm hover:border-[#d8ff45] hover:text-[#d8ff45]">
              Instagram <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} EraVault</p>
          <p>Archive clothing / Next era</p>
        </div>
      </div>
    </footer>
  );
}