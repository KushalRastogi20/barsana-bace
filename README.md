# 🪷 Hare Krishna — ISKCON Divine Gallery

> A divine, interactive, and emotionally uplifting Next.js platform connecting devotees with Sri Krishna through sacred visuals and design.

---

## ✨ Features

- **Immersive Hero** — Glowing "Hare Krishna" title, animated aura rings, temple silhouette, floating light beams
- **Maha Mantra Section** — Full mantra in Devanagari & English with rhythmic breathing animation
- **Divine Leelas** — Dynamic event cards fetched via Axios (`/api/leelas`) with graceful mock fallback
- **Sacred Gallery** — Responsive photo/video grid with golden glow hover effects
- **Holy Vaishnavas** — Sri Chaitanya Mahaprabhu, Lord Jagannath, Srila Prabhupada, All Six Goswamis
- **Floating Particle Canvas** — Gold & peacock-blue particles across the full screen
- **Floating Lotus Petals** — Continuous petal rain animation
- **🔔 Chant Toggle** — Nav button that pulses the page with spiritual energy
- **Fully Responsive** — Mobile, tablet, and desktop

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
krishna-gallery/
├── app/
│   ├── layout.tsx           # Root layout (fonts, metadata)
│   ├── page.tsx             # Home page — composes all sections
│   ├── globals.css          # Global styles, Tailwind, animations
│   ├── gallery/
│   │   └── page.tsx         # Full gallery page
│   └── api/
│       ├── leelas/
│       │   └── route.ts     # GET /api/leelas
│       └── gallery/
│           └── folders/
│               └── route.ts # GET /api/gallery/folders
├── components/
│   ├── ParticleCanvas.tsx   # Canvas particle system
│   ├── FloatingPetals.tsx   # Falling petal animation
│   ├── Navbar.tsx           # Sticky nav + chant toggle
│   ├── HeroSection.tsx      # Hero with aura, beams, CTAs
│   ├── MantraSection.tsx    # Maha Mantra display
│   ├── LeelasSection.tsx    # Axios-powered event cards
│   ├── SaintsSection.tsx    # Vaishnavas, Prabhupada, Goswamis
│   ├── GallerySection.tsx   # Gallery preview grid
│   ├── QuoteStrip.tsx       # Bhagavad Gita quote
│   ├── Footer.tsx           # Footer with nav + mantra
│   └── SectionDivider.tsx   # Decorative divider
└── lib/
    ├── data.ts              # All types + static/mock data
    └── api.ts               # Axios fetchers with fallback
```

---

## 🔌 Connecting Your Backend

### Leelas / Events

Edit `app/api/leelas/route.ts` and replace the mock data:

```ts
// With Prisma
const leelas = await prisma.leela.findMany({ orderBy: { date: "desc" } });

// With Contentful
const entries = await client.getEntries({ content_type: "leela" });

// With Sanity
const leelas = await client.fetch(`*[_type == "leela"] | order(date desc)`);
```

### Gallery Photos / Videos

Edit `app/api/gallery/folders/route.ts`:

```ts
// With AWS S3
const { Contents } = await s3.listObjectsV2({ Bucket: "your-bucket", Delimiter: "/" }).promise();

// With Cloudinary
const { resources } = await cloudinary.api.resources({ type: "upload", prefix: "gallery/" });
```

### External API (optional)

Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to point Axios at your external backend:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.your-backend.com
```

---

## 🎨 Design System

| Token | Value | Use |
|-------|-------|-----|
| `gold-300` | `#f9d348` | Primary accent |
| `gold-400` | `#f0b429` | Glow / shimmer |
| `peacock-300` | `#5bbdd4` | Secondary accent |
| `peacock-400` | `#2196b3` | Peacock blue |
| `saffron-400` | `#ff8c00` | Gallery accent |
| `divine-bg` | `#070410` | Page background |

**Fonts:**
- `font-cinzel` — Cinzel Decorative (headings, nav)
- `font-cormorant` — Cormorant Garamond (body)
- `font-fell` — IM Fell English (quotes, captions)
- `font-devanagari` — Noto Serif Devanagari (Sanskrit)

---

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS v3**
- **Axios** (API fetching with graceful fallback)
- **Framer Motion** (available — add to any component)
- **Canvas API** (particle system)

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

*Hare Krishna Hare Krishna Krishna Krishna Hare Hare*  
*Hare Rama Hare Rama Rama Rama Hare Hare* 🪷
# barsana-bace
