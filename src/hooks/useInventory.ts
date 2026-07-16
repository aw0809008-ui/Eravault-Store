import { useState, useEffect } from 'react';
import { supabase, StoreItem, DbRow, toStoreItem } from '../lib/supabase';

export function useInventory() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('inventory')
        .select('*')
        .eq('show_on_website', true)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const rows = (data || []) as DbRow[];
      const storeItems = rows.map(toStoreItem);
      setItems(storeItems);

      const cats = [...new Set(storeItems.map(item => item.category).filter(Boolean))];
      setCategories(cats);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(message);
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  }

  return { items, loading, error, categories, refetch: fetchItems };
}
