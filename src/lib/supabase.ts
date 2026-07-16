import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zbfyssmoksvmvqyomqjy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZnlzc21va3N2bXZxeW9tcWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNzIxNjksImV4cCI6MjA5OTc0ODE2OX0._1TV-Ova2MJp5N5N-v6MiULYdd1gDpweQNtXFOfwzOE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Matches ACTUAL database columns in Eravault-Vintage inventory table
export interface DbRow {
  id: string;
  item_name: string;
  category: string;
  size: string;
  condition: string;
  sourcing_cost: number;
  selling_price: number | null;
  status: string;
  sourcing_date: string;
  sold_date: string | null;
  notes: string | null;
  listing_link: string | null;
  images: string | null;
  videos: string | null;
  pieces: number | null;
  sale_channel: string | null;
  show_on_website: boolean;
  created_at: string;
  updated_at: string;
}

// Frontend-friendly interface for the store
export interface StoreItem {
  id: string;
  name: string;
  category: string;
  size: string;
  condition: string;
  price: number | null;
  status: string;
  notes: string | null;
  images: string[];
  videos: string[];
  pieces: number;
  created_at: string;
}

// Convert DB row to store-friendly format
export function toStoreItem(row: DbRow): StoreItem {
  return {
    id: row.id,
    name: row.item_name,
    category: row.category,
    size: row.size,
    condition: row.condition,
    price: row.selling_price,
    status: row.status,
    notes: row.notes,
    images: row.images ? row.images.split(',').filter(Boolean) : [],
    videos: row.videos ? row.videos.split(',').filter(Boolean) : [],
    pieces: row.pieces || 1,
    created_at: row.created_at,
  };
}
