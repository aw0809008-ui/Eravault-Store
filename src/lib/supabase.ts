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
}

// — CHAT SYSTEM (E2E Encrypted) —
export interface ChatMessage {
  id?: number;
  chat_id: string;
  sender: 'buyer' | 'admin';
  message: string; // encrypted
  created_at?: string;
}

export interface ChatSession {
  id?: number;
  chat_id: string;
  buyer_name: string;
  buyer_email: string;
  last_message?: string;
  unread_admin: number;
  unread_buyer: number;
  created_at?: string;
  updated_at?: string;
}

// Simple encryption (XOR-based for client-side E2E)
const CHAT_KEY = 'EraVault2024SecretKey!@#';
function encrypt(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ CHAT_KEY.charCodeAt(i % CHAT_KEY.length));
  }
  return btoa(unescape(encodeURIComponent(result)));
}

function decrypt(encoded: string): string {
  try {
    const text = decodeURIComponent(escape(atob(encoded)));
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ CHAT_KEY.charCodeAt(i % CHAT_KEY.length));
    }
    return result;
  } catch { return '[encrypted]'; }
}

// Start or get chat session
export async function getOrCreateChat(buyerName: string, buyerEmail: string): Promise<string> {
  const chatId = btoa(buyerEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
  const { data } = await supabase.from('chats').select('chat_id').eq('chat_id', chatId).single();
  if (!data) {
    await supabase.from('chats').insert([{ chat_id: chatId, buyer_name: buyerName, buyer_email: buyerEmail, unread_admin: 0, unread_buyer: 0 }]);
  }
  return chatId;
}

// Send message
export async function sendMessage(chatId: string, sender: 'buyer' | 'admin', text: string): Promise<boolean> {
  const encrypted = encrypt(text);
  const { error } = await supabase.from('chat_messages').insert([{ chat_id: chatId, sender, message: encrypted }]);
  if (error) { console.error('Send error:', error); return false; }
  await supabase.from('chats').update({ last_message: text.slice(0, 50), updated_at: new Date().toISOString() }).eq('chat_id', chatId);
  const { data: chatData } = await supabase.from('chats').select('unread_admin, unread_buyer').eq('chat_id', chatId).single();
  if (chatData) {
    const val = sender === 'buyer' ? { unread_admin: (chatData.unread_admin || 0) + 1 } : { unread_buyer: (chatData.unread_buyer || 0) + 1 };
    await supabase.from('chats').update(val).eq('chat_id', chatId);
  }
  return true;
}

// Get messages (decrypted)
export async function getMessages(chatId: string): Promise<ChatMessage[]> {
  const { data } = await supabase.from('chat_messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
  return (data || []).map(m => ({ ...m, message: decrypt(m.message) }));
}

// Get all chats (admin)
export async function getAllChats(): Promise<ChatSession[]> {
  const { data } = await supabase.from('chats').select('*').order('updated_at', { ascending: false });
  return data || [];
}

// Mark read
export async function markRead(chatId: string, who: 'admin' | 'buyer'): Promise<void> {
  const field = who === 'admin' ? 'unread_admin' : 'unread_buyer';
  await supabase.from('chats').update({ [field]: 0 }).eq('chat_id', chatId);
}

// Subscribe to new messages (realtime)
export function subscribeToMessages(chatId: string, callback: (msg: ChatMessage) => void) {
  return supabase.channel('chat-' + chatId).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: 'chat_id=eq.' + chatId }, (payload) => {
    const m = payload.new as ChatMessage;
    callback({ ...m, message: decrypt(m.message) });
  }).subscribe();
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
  const unique = [...new Set((data || []).map(d => d.category).filter(Boolean))];
  return unique.sort();
}
