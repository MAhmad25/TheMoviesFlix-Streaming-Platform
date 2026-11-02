/**
 * Stream provider using vidrift.in embed service.
 * Works uniformly across all browsers (Chrome, Firefox, Safari, Edge, etc.).
 *
 * URL patterns:
 *   Movie: https://embed.vidrift.in/embed/movie/{tmdbId}
 *   TV:    https://embed.vidrift.in/embed/tv/{tmdbId}/{season}/{episode}
 */

const VIDRIFT_BASE = "https://embed.vidrift.in/embed";

/**
 * Returns the name of the active stream provider (used by analytics).
 */
export function getStreamProvider() {
      return "vidrift";
}

export function getStreamUrl({ category, id, season, episode }) {
      if (category === "tv") {
            return `${VIDRIFT_BASE}/tv/${id}/${season}/${episode}`;
      }

      return `${VIDRIFT_BASE}/movie/${id}`;
}
