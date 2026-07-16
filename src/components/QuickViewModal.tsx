import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, Play, Share2, ShieldCheck, Truck, X } from 'lucide-react';
import type { StoreItem } from '../lib/supabase';
import { MEDIA, conditionLabel, getWhatsAppUrl } from '../lib/store';

interface QuickViewModalProps {
  item: StoreItem | null;
  onClose: () => void;
}

export default function QuickViewModal({ item, onClose }: QuickViewModalProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!item) return;
    setActive(0);
    document.body.classList.add('modal-open');
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [item, onClose]);

  const media = item ? [
    ...item.images.map((url) => ({ type: 'image' as const, url })),
    ...item.videos.map((url) => ({ type: 'video' as const, url })),
  ] : [];

  const gallery = media.length > 0 ? media : [{ type: 'image' as const, url: MEDIA.racks }];

  const share = async () => {
    if (!item) return;
    const data = { title: item.name, text: `Take a look at ${item.name} on EraVault`, url: window.location.href };
    if (navigator.share) await navigator.share(data);
    else await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" onClick={onClose}>
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 250, damping: 30 }}
            className="absolute inset-y-0 right-0 w-full max-w-6xl overflow-y-auto bg-[#f3f0e8] text-[#171713]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-black/15 bg-[#f3f0e8]/95 px-5 backdrop-blur-xl sm:px-8">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em]">Product details</span>
              <div className="flex items-center">
                <button onClick={share} className="focus-ring grid h-11 w-11 place-items-center" aria-label="Share item"><Share2 className="h-4 w-4" /></button>
                <button onClick={onClose} className="focus-ring grid h-11 w-11 place-items-center" aria-label="Close product details"><X className="h-5 w-5" /></button>
              </div>
            </div>

            <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1.2fr_0.8fr]">
              <div className="bg-[#dcd5c8] p-3 sm:p-6 lg:p-10">
                <div className="relative mx-auto aspect-[4/5] max-h-[calc(100vh-8rem)] overflow-hidden bg-[#cbc4b7]">
                  {gallery[active].type === 'video' ? (
                    <video src={gallery[active].url} controls autoPlay muted playsInline className="h-full w-full object-contain" />
                  ) : (
                    <img src={gallery[active].url} alt={item.name} className="h-full w-full object-contain" />
                  )}
                  {gallery.length > 1 && (
                    <>
                      <button onClick={() => setActive((active - 1 + gallery.length) % gallery.length)} className="focus-ring absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center bg-[#f3f0e8]" aria-label="Previous image"><ChevronLeft className="h-5 w-5" /></button>
                      <button onClick={() => setActive((active + 1) % gallery.length)} className="focus-ring absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center bg-[#f3f0e8]" aria-label="Next image"><ChevronRight className="h-5 w-5" /></button>
                    </>
                  )}
                </div>
                {gallery.length > 1 && (
                  <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
                    {gallery.map((entry, index) => (
                      <button key={`${entry.url}-${index}`} onClick={() => setActive(index)} className={`focus-ring relative h-20 w-16 shrink-0 overflow-hidden border-2 ${active === index ? 'border-[#171713]' : 'border-transparent opacity-55'}`}>
                        {entry.type === 'video' ? <div className="grid h-full w-full place-items-center bg-[#171713] text-white"><Play className="h-4 w-4 fill-current" /></div> : <img src={entry.url} alt="" className="h-full w-full object-cover" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col p-6 sm:p-10 lg:p-14">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">{item.category} / Ref. {item.id.slice(0, 6).toUpperCase()}</p>
                <h2 className="display mt-5 text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-6xl">{item.name}</h2>
                <p className="mt-7 text-2xl font-extrabold">{item.price ? `GBP ${item.price.toLocaleString()}` : 'Price on request'}</p>

                <dl className="mt-10 border-y border-black/15">
                  {[
                    ['Size', item.size || 'One size'],
                    ['Condition', conditionLabel(item.condition)],
                    ['Availability', item.status.toLowerCase() === 'sold' ? 'Sold' : `${item.pieces} available`],
                  ].map(([term, value]) => (
                    <div key={term} className="flex justify-between border-b border-black/10 py-4 last:border-0">
                      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">{term}</dt>
                      <dd className="text-sm font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>

                {item.notes && <p className="mt-8 text-sm leading-7 text-black/65">{item.notes}</p>}

                <a href={getWhatsAppUrl(item)} target="_blank" rel="noreferrer" className="focus-ring mt-10 inline-flex min-h-14 items-center justify-center gap-3 bg-[#171713] px-6 text-xs font-extrabold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#9c3f24]">
                  Buy on WhatsApp <MessageCircle className="h-4 w-4" />
                </a>

                <div className="mt-10 grid gap-5 border-t border-black/15 pt-8 sm:grid-cols-2">
                  <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="text-xs font-extrabold uppercase tracking-[0.12em]">Condition checked</p><p className="mt-1 text-xs leading-5 text-black/50">Every piece is inspected and graded before listing.</p></div></div>
                  <div className="flex gap-3"><Truck className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="text-xs font-extrabold uppercase tracking-[0.12em]">Tracked dispatch</p><p className="mt-1 text-xs leading-5 text-black/50">Shipping is confirmed with you on WhatsApp.</p></div></div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}