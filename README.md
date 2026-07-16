# 🏛️ EraVault Store — Premium Vintage Collection

A stunning 3D immersive storefront for vintage & antique items, powered by Supabase.

## ✨ Features
- 🎨 Full 3D design with particles, rotating cubes, parallax effects
- 📦 Supabase integration (`show_on_website = true` filter)
- 🃏 Interactive 3D tilt cards with holographic shine
- 🔍 Category filter & instant search
- 💬 WhatsApp "Buy Now" on every item
- 📱 Fully mobile responsive
- ✨ Framer Motion animations

## 🚀 Setup
```bash
npm install
npm run dev
```

## 🔗 Supabase
Run this SQL to add the website toggle column:
```sql
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS show_on_website BOOLEAN DEFAULT false;
```

## 📋 Deploy to Vercel
1. Push to GitHub
2. Import on Vercel
3. Framework: **Vite**
4. Build: `npm run build`
5. Output: `dist`

## 🛠 Tech Stack
React 19 • Vite • Tailwind CSS 4 • Supabase • Framer Motion • Lucide Icons
