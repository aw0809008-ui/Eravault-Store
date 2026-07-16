# EraVault Store — Premium Vintage Fashion

![EraVault Store](https://images.pexels.com/photos/35045845/pexels-photo-35045845.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=800)

## 🛍️ About

EraVault is a premium vintage and pre-owned fashion e-commerce store built with React, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features

### 🌐 Website Features
- **3D Animations** - Floating elements, card hover effects, smooth transitions
- **Hero Section** - Full-screen parallax with gradient overlays
- **Product Grid** - Search, filter by category, sort options
- **Product Modal** - Image carousel with thumbnails
- **WhatsApp Integration** - Buy Now button with pre-filled message
- **Responsive Design** - Mobile-first approach
- **Contact Section** - WhatsApp, Instagram, Email

### 🔐 Admin Dashboard
- **Dashboard** - Stats overview (total products, listed, value, categories)
- **Products Management** - View, edit, delete, toggle visibility
- **Add Products** - Form with all fields
- **Toggle Listing** - One-click show/hide on website

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔑 Admin Access

1. **Double-click** on the EraVault logo in the navbar
2. Enter password: `eravault2024`
3. Manage your inventory!

## 📧 Contact Information

- **Email:** eravaultvintage@gmail.com
- **Instagram:** [@Eravault_vintage](https://instagram.com/Eravault_vintage)
- **WhatsApp:** Available on website

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL)
- **Build:** Vite
- **Styling:** Custom 3D CSS animations

## 📁 Project Structure

```
src/
├── App.tsx                 # Main app component
├── index.css               # Global styles & animations
├── lib/
│   └── supabase.ts         # Database operations
└── components/
    ├── Navbar.tsx          # Navigation with admin trigger
    ├── Hero.tsx            # Hero section
    ├── ShopSection.tsx     # Product grid
    ├── ProductCard.tsx     # Product cards
    ├── ProductModal.tsx    # Product detail modal
    ├── AboutSection.tsx    # About section
    ├── ContactSection.tsx  # Contact section
    ├── Footer.tsx          # Footer
    ├── WhatsAppFloat.tsx   # Floating WhatsApp button
    └── AdminDashboard.tsx  # Complete admin panel
```

## 📊 Database Schema

Table: `inventory`
| Column | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| item_name | text | Product name |
| category | text | Product category |
| size | text | Size (S, M, L, etc.) |
| condition | text | Condition (Brand New, Like New, Good, Fair) |
| selling_price | numeric | Price in Rs. |
| images | text | Comma-separated image URLs |
| videos | text | Comma-separated video URLs |
| pieces | int | Stock quantity |
| show_on_website | boolean | Visibility toggle |

## 📜 License

© 2024 EraVault Store. All rights reserved.

---

Made with ❤️ for vintage fashion lovers
