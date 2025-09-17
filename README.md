# MoviesFlixWeb

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat-square)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

MoviesFlixWeb is a purpose-built streaming platform for movie and TV lovers — not a shallow UI clone but a working, modern streaming site with first-class UX, powerful search, and an integrated playback experience.

## Key Highlights

- Purposeful video streaming: built-in streaming player with adaptive UI for movies, trailers, and episodic TV playback — a core product feature that goes beyond static data displays.
- Unique UI and visuals: custom components (e.g., LiquidGlass, Orb, Dock, and animated loaders) provide a visually striking experience uncommon in open-source media projects.
- Fast and modern stack: Vite + React with TailwindCSS for ultrafast dev feedback and a responsive, accessible interface.
- Search-first experience: discover content quickly via the Search page and contextual detail pages (movies, people, TV shows).
- Production-ready deployment: configured for Vercel for instant global delivery.

## Demo & Deployment

The site is deployed on Vercel. If you haven't already, connect your repo to Vercel and the provided deployment settings will build automatically using the included `vite` configuration.

Live demo: (https://themoviesflix.vercel.app/)

## What makes MoviesFlixWeb special

- Real streaming workflow: The app integrates streaming routes and playback components so visitors can play full-length content and trailers in a unified player — not just embedded iframes. This is central to the product: content discovery -> detail -> stream.
- Attention to UI detail: Custom components like `LiquidGlass`, `Orb`, `Dock`, and `TrendingContainer` implement polished motion and glassmorphism effects that give the site a premium look and feel.
- Designed for discoverability: each detail page (movie, TV, person) contains structured data-ready layout and metadata so it can be extended for SEO and social previews.

## Tech stack

- Framework: React (Vite)
- Styling: Tailwind CSS + custom fonts
- State management: local store with slices in `src/store` (movies, people, tv)
- HTTP client: Axios at `src/utils/axios.js`
- Routing: React Router (see `src/routes/RouterHandler.jsx`)

## Project structure (excerpt)

- `src/Components` — UI and page components (Card, Navbar, Loaders, Dock, LiquidGlass)
- `src/store` — Redux-like slices and actions (moviesSlice, peopleSlicer, tvSlice)
- `src/utils/axios.js` — API client
- `index.html` — main HTML with root and meta

## Screens & Features

- Home page: curated lists, trending carousel, featured content
- Search: full-text search with fast results
- Movie / TV detail pages: cast, seasons, reviews, trailers, and a dedicated stream button
- Stream pages: optimized playback layout with keyboard accessibility and responsive controls
- People pages: biography, credits, and media

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

- The project expects a movie/TV data source (TMDB or similar) and an asset/streaming backend for protected content. For demos the code can be pointed at a public API.

## Environment / configuration

- Provide API keys via environment variables (example - replace with your provider):

```env
VITE_API_BASE_URL=https://api.themoviedb.org/3
VITE_API_KEY=your_api_key_here
```

Add these in Vercel project settings as environment variables for production.

## SEO & Social preview

The project includes an `index.html` file you can extend with meta tags, Open Graph tags, Twitter Card tags, and JSON-LD structured data. This improves link previews and search appearance.

## Contributing

Contributions are welcome. Please follow this workflow:

1. Fork the repo
2. Create a topic branch: `git checkout -b feature/awesome-feature`
3. Make changes and include tests where appropriate
4. Commit and push: `git commit -am "Add feature" && git push origin feature/awesome-feature`
5. Open a Pull Request with a clear description

## Tests

There are no automated tests included by default. Consider adding unit tests (Jest + React Testing Library) and simple integration tests for the streaming flows.

## Roadmap / Next steps

- Add server-side streaming support (HLS/DASH) and secure token delivery
- Implement search indexing + server-side rendering for improved SEO
- Add user accounts, watchlist, and recommendations

## License

This project is released under the MIT License.

---

If you'd like, I can also:

- Add structured JSON-LD examples to `index.html` for VideoObject and WebSite
- Add more precise SEO tags (canonical, robots, social images) tailored to your Vercel URL

If you want me to update `index.html` now, I'll proceed to add recommended SEO/meta tags and JSON-LD structured data.
