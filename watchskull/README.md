# 💀 WatchSkull

> Dead serious about what you watch.

A dark, cinematic movie & TV tracker. Discover titles, build your library, manage a watchlist, and track your stats — all in one place.

---

## Stack

- React 18 + Vite
- TMDB API (free, public key included)
- localStorage for persistence (no backend required)

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B — GitHub → Vercel (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Framework: **Vite** (auto-detected)
5. Build command: `npm run build`
6. Output directory: `dist`
7. Click Deploy

Vercel will redeploy automatically on every push to `main`.

---

## Features

- 🔍 **Discover** — Search + browse trending & top rated via TMDB
- 📚 **Library** — Separate Shows & Films tabs with status, platform, rating, review, season/episode tracking
- 📋 **Watchlist** — Queue titles, one-click move to library
- 📊 **The Record** — Stats by status, platform, and your top rated titles

---

## Notes

- The TMDB API key included is a public read-only demo key.
- All data is stored in `localStorage` — no account needed.
- To get your own TMDB key: [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (free)
  Then replace `TMDB_KEY` in `src/tmdb.js`
