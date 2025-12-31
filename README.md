# MoviesFlix PWA

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat-square)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**MoviesFlixWeb** is a purpose-built **streaming platform** for movie and TV lovers  not a shallow UI clone but a working, modern product with **first-class UX**, **powerful search**, and an **integrated playback experience** .

## Screens & Features

-  **Home**: curated lists, trending carousel, and featured content
-  **Search**: full-text search with fast results and instant previews
-  **Movie/TV detail pages**: cast, seasons, reviews, trailers, and a dedicated **Stream** button
-  **Stream pages**: optimized playback layout with keyboard accessibility, responsive controls, and an immersive viewing UI
-  **People pages**: biography, credits, and media galleries

## Key Highlights

-  **Purposeful video streaming**: built-in streaming player with adaptive UI for movies, trailers, and episodic TV playback — a core product feature that goes beyond static data displays. **Play full-length content** and trailers in a unified player 
-  **Unique UI & visuals**: custom components like **LiquidGlass**, **Orb**, and **Dock** (plus animated loaders) give the site a premium, cinematic look — a visual language you won't find in typical clones 
-  **Fast modern stack**: Vite + React + Tailwind CSS for ultrafast dev feedback and a responsive, accessible interface.
-  **Search-first experience**: discover content quickly via the Search page and contextual detail pages (movies, people, TV shows).
-  **Production-ready**: configured for Vercel for instant global delivery and fast edge caching.

## Demo & Deployment

The site is deployed on Vercel. If you haven't already, connect your repo to Vercel — the included `vite` configuration will build automatically.

Live demo: **https://themoviesflix.vercel.app/** 

## What makes MoviesFlixWeb special

-  **Real streaming workflow**: integrated streaming routes and playback components so visitors can **play full-length content and trailers** in a unified player — not just embedded iframes. This is the end-to-end user flow: **discover → detail → stream**.
-  **Attention to UI detail**: components like **LiquidGlass**, **Orb**, **Dock**, and **TrendingContainer** implement polished motion and glassmorphism effects that give the site a premium cinematic brand.
- **Designed for discoverability**: each detail page (movie, TV, person) is structured and metadata-ready so it can be extended for SEO and social previews (rich cards, JSON-LD).

## Tech stack

- Framework: **React (Vite)**
- Styling: **Tailwind CSS** + custom fonts
- State management: local store with slices in `src/store` (movies, people, tv)
- HTTP client: **Axios** at `src/utils/axios.js`
- Routing: **React Router** (see `src/routes/RouterHandler.jsx`)

## Project structure (excerpt)

- `src/Components` — UI and page components (Card, Navbar, Loaders, Dock, LiquidGlass)
- `src/store` — Redux-like slices and actions (moviesSlice, peopleSlicer, tvSlice)
- `src/utils/axios.js` — API client
- `index.html` — main HTML with root and meta

## How to run locally

1. Clone the repository

```bash
git clone https://github.com/MAhmad25/MoviesFlixWeb.git
cd MoviesFlixWeb
```

2. Install dependencies

```bash
npm install
```

3. Start the dev server

```bash
npm run dev
```

4. Open http://localhost:5173 (Vite default port) in your browser

Notes

-  The project expects a movie/TV data source (TMDB or similar) and an asset/streaming backend for protected content. For demos the code can be pointed at a public API.

## Environment / configuration

- Provide API keys via environment variables (example - replace with your provider):

```env
VITE_API_BASE_URL=https://api.themoviedb.org/3
VITE_API_KEY=your_api_key_here
```

Add these in Vercel project settings as environment variables for production.

## SEO & Social preview

The project includes an `index.html` file you can extend with meta tags, Open Graph tags, Twitter Card tags, and JSON-LD structured data. This improves link previews and search appearance — **important for discoverability** .

## Contributing

Contributions are welcome — **thank you** for considering a PR! 

1. Fork the repo
2. Create a topic branch: `git checkout -b feature/awesome-feature`
3. Make changes and include tests where appropriate
4. Commit and push: `git commit -am "Add feature" && git push origin feature/awesome-feature`
5. Open a Pull Request with a clear description

## Tests

There are no automated tests included by default. Consider adding unit tests (Jest + React Testing Library) and simple integration tests for the streaming flows.

## Roadmap / Next steps

-  Add server-side streaming support (HLS/DASH) and secure token delivery
-  Implement search indexing + server-side rendering for improved SEO
-  Add user accounts, watchlist, and personalized recommendations

## License

This project is released under the MIT License.

---
