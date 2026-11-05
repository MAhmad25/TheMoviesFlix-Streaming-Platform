# MoviesFlix PWA

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat-square)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<img src="https://i.ibb.co/DDQwDCfX/533shots-so.png" alt="533shots so" border="0">

**MoviesFlixWeb** is a purpose-built **streaming platform** for movie and TV lovers  not a shallow UI clone but a working, modern product with **first-class UX**, **powerful search**, and an **integrated playback experience** .

## Download Android Version :  <a target="_blank" href="https://github.com/MAhmad25/TheMoviesFlix-Streaming-Platform/releases/download/Android/MoviesFlix.apk">MoviesFlix</a>

<img width="1920" height="1440" alt="991_1x_shots_so" src="https://github.com/user-attachments/assets/ce107e17-b04b-46a7-8ea6-aa7c3e634de9" />
<img width="1920" height="1440" alt="648shots_so" src="https://github.com/user-attachments/assets/3f892f84-d05f-4711-8bf6-4ec689803325" />
<img width="1920" height="1440" alt="144_1x_shots_so" src="https://github.com/user-attachments/assets/a8a461e9-3b19-4b6b-8b76-40f825a019c0" />
<img width="1920" height="1440" alt="386_1x_shots_so" src="https://github.com/user-attachments/assets/32f9ae89-4f2b-4516-a1cd-320ab699e5a6" />
<img width="1920" height="1440" alt="580_1x_shots_so" src="https://github.com/user-attachments/assets/47222bbc-c62b-496b-85f9-f5f25bfb294c" />
<img width="1920" height="1440" alt="56_1x_shots_so" src="https://github.com/user-attachments/assets/2a1ff47b-378a-449b-a46d-09ea97212364" />

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

## Analytics

PostHog tracks anonymous visitors, routes, movie/TV detail views, watch and trailer opens, trailer playback, and search usage. See [analytics setup and reporting](docs/analytics.md) for Vercel environment variables, event definitions, and dashboard recipes. Copy `.env.example` for the available configuration options; local development is excluded by default.

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

Run `npm run test:analytics` to verify PostHog configuration, route attribution, TV episode parameters, and title matching. Run `npm run build` to validate the production bundle.

## Roadmap / Next steps

-  Add server-side streaming support (HLS/DASH) and secure token delivery
-  Implement search indexing + server-side rendering for improved SEO
-  Add user accounts, watchlist, and personalized recommendations

<img src="https://i.ibb.co/1tXZTT93/to-Post.png" alt="to Post" border="0">

## License

This project is released under the MIT License.

---
