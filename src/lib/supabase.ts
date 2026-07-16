import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zbfyssmoksvmvqyomqjy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZnlzc21va3N2bXZxeW9tcWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNzIxNjksImV4cCI6MjA5OTc0ODE2OX0._1TV-Ova2MJp5N5N-v6MiULYdd1gDpweQNtXFOfwzOE';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface InventoryItem {
  id?: number;
  item_name: string;
  category: string;
  size: string;
  condition: string;
  selling_price: number;
  cost_price?: number;
  images: string;
  videos: string;
  pieces: number;
  show_on_website: boolean;
  created_at?: string;
  description?: string;
  listing_link?: string;
  thumbnail?: string;
}

// Fetch products for website (only show_on_website = true)
export async function fetchInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('show_on_website', true)
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
  return data || [];
}

// Fetch ALL products for admin
export async function fetchAllInventory(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching all inventory:', error);
    return [];
  }
  return data || [];
}

// Fetch categories
export async function fetchCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('inventory')
    .select('category')
    .eq('show_on_website', true);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  const categories = [...new Set((data || []).map((d: { category: string }) => d.category).filter(Boolean))];
  return categories as string[];
}

// Fetch all categories for admin
export async function fetchAllCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('inventory')
    .select('category');

  if (error) {
    console.error('Error fetching all categories:', error);
    return [];
  }

  const categories = [...new Set((data || []).map((d: { category: string }) => d.category).filter(Boolean))];
  return categories as string[];
}

// Add new product
export async function addProduct(product: Omit<InventoryItem, 'id' | 'created_at'>): Promise<InventoryItem | null> {
  const { data, error } = await supabase
    .from('inventory')
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error);
    return null;
  }
  return data;
}

// Update product
export async function updateProduct(id: number, updates: Partial<InventoryItem>): Promise<boolean> {
  const { error } = await supabase
    .from('inventory')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    return false;
  }
  return true;
}

// Delete product
export async function deleteProduct(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  return true;
}

// Toggle show_on_website
export async function toggleShowOnWebsite(id: number, show: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('inventory')
    .update({ show_on_website: show })
    .eq('id', id);

  if (error) {
    console.error('Error toggling show_on_website:', error);
    return false;
  }
  return true;
}

// Get stats
export async function getStats() {
  const { data: allProducts } = await supabase.from('inventory').select('*');
  const { data: listedProducts } = await supabase.from('inventory').select('*').eq('show_on_website', true);
  
  const products = allProducts || [];
  const listed = listedProducts || [];
  
  const totalValue = products.reduce((sum, p) => sum + (Number(p.selling_price) * Number(p.pieces || 1)), 0);
  const totalPieces = products.reduce((sum, p) => sum + Number(p.pieces || 1), 0);
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  
  return {
    totalProducts: products.length,
    listedProducts: listed.length,
    totalValue,
    totalPieces,
    totalCategories: categories.length,
  };
}
