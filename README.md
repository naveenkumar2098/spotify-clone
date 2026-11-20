# Full-Stack Spotify Clone

A premium, production-ready audio streaming platform built to emulate the core functionality and aesthetic of Spotify. This project demonstrates mastery over modern web architecture, complex state management, database integration, and high-performance UI/UX design.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL) via [`@supabase/ssr`](https://supabase.com/docs/guides/auth/server-side/nextjs)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Audio Engine**: [Howler.js](https://howlerjs.com/) (via `use-sound`)
- **Animations**: [AnimeJS](https://animejs.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)

## ✨ Key Features

### 🎧 Advanced Audio Player
- **Continuous Playback**: Music keeps playing globally across route transitions without interruption.
- **Gapless Looping & Shuffle**: Implemented native audio engine APIs to provide seamless, gapless "Repeat One" functionality and a true algorithmic shuffle that isolates the active track.
- **Dynamic Queue System**: Interactive, drag-and-drop queue management allowing users to reorder their listening session on the fly.
- **Scrubbing & Volume Control**: Real-time progress bar polling and volume slider built with Radix UI.

### 💾 Data & Architecture
- **Server Components & Actions**: Heavily utilizes Next.js Server Components for initial data fetching, significantly reducing client-side JavaScript payload and improving TTFB.
- **Supabase Integration**: 
  - **Auth**: Secure user authentication (Email/Password & OAuth).
  - **Storage**: Secure bucket storage for MP3 files and high-res cover art.
  - **PostgreSQL**: Relational schema handling Users, Songs, Liked Songs, and Subscription status.
- **Cross-Component Synchronization**: Implemented custom DOM event dispatchers to synchronize complex local state (like the "Heart" button) across deeply nested, decoupled client components without over-relying on global stores.

### 💎 Premium User Experience
- **Responsive Design**: Mobile-first architecture that seamlessly transitions into a complex, multi-pane desktop layout.
- **Micro-Animations**: Utilizes `anime.js` to deliver tactile, hardware-accelerated animations (staggered grid reveals, spring-physics buttons, smooth slide-up modals) that don't block the React render cycle.
- **Skeleton Loading**: Graceful loading states (Boneyards) to eliminate layout shift and improve perceived performance during data fetching.

### 💳 Subscriptions (not yet implemented)
- The database schema and TypeScript types include Stripe-style tables (`customers`, `products`, `prices`, `subscriptions`), but there are currently **no Stripe checkout or webhook routes**. Subscription UI buttons are placeholders.

## 🛠️ Local Development

### Prerequisites
- Node.js 24 LTS (see `.nvmrc`; minimum supported is 20.9)
- A Supabase Project

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd spotify-clone
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and populate it with your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 4. Apply database security policies
Row Level Security policies, storage policies and bucket limits live in `supabase/migrations/20261120000000_rls_hardening.sql`. It is **not applied automatically**: review it, then run it with `supabase db push` or the Supabase SQL editor.

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## 🔒 Security & CI
- Auth uses `@supabase/ssr`; `proxy.ts` refreshes the session on each request.
- Uploads are validated client-side (MP3 up to 20MB, PNG/JPEG/WebP images up to 5MB) and storage paths are sanitized; enforce the same limits server-side with the migration above.
- GitHub Actions (`.github/workflows/ci.yml`) runs lint, `npm audit --audit-level=high` and the build; Dependabot is configured for npm and GitHub Actions.

## 🏗️ Future Roadmap
- [ ] User Profiles & Follows
- [ ] Collaborative Playlists via WebSockets
- [ ] CDN integration for global asset delivery
- [ ] Advanced lyrics synchronization

---

*Designed and engineered as a showcase of modern, product-grade web development.*
