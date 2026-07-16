import { useState, useEffect } from 'react';
import { supabase, StoreItem, DbRow, toStoreItem } from '../lib/supabase';

export function useInventory() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel('public-store-inventory')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, fetchItems)
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('inventory').select('*').eq('show_on_website', true)
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      const rows = (data || []) as DbRow[];
      const storeItems = rows.map(toStoreItem);
      setItems(storeItems);
      setCategories([...new Set(storeItems.map(i => i.category).filter(Boolean))].sort());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'We could not load the collection.');
    } finally { setLoading(false); }
  }
  return { items, loading, error, categories, refetch: fetchItems };
}
