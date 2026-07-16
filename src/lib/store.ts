import type { StoreItem } from './supabase';

export const STORE = {
  name: 'EraVault',
  tagline: 'Archive clothing. One piece at a time.',
  whatsappNumber: '919876543210',
  email: 'hello@eravault.store',
  instagram: 'https://instagram.com',
};

export const MEDIA = {
  hero: 'https://images.pexels.com/photos/35045845/pexels-photo-35045845.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1920',
  editorial: 'https://images.pexels.com/photos/19583558/pexels-photo-19583558.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  racks: 'https://images.pexels.com/photos/8386643/pexels-photo-8386643.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400',
  denim: 'https://images.pexels.com/photos/6276001/pexels-photo-6276001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400',
};

export function getWhatsAppUrl(item?: StoreItem) {
  const message = item
    ? `Hi EraVault, I want to buy "${item.name}"${item.size ? ` in size ${item.size}` : ''}${item.price ? ` for GBP ${item.price.toLocaleString()}` : ''}. Is it available?`
    : 'Hi EraVault, I would like to know more about your vintage collection.';

  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function conditionLabel(condition: string) {
  const labels: Record<string, string> = {
    a: 'Excellent',
    ab: 'Very good',
    b: 'Good',
    bc: 'Fair',
    c: 'Worn',
    abc: 'Mixed',
  };

  return labels[condition.toLowerCase()] || condition;
}