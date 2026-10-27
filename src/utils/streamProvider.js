const EDGE_USER_AGENT = /(?:Edg(?:e|A|iOS)?|Edge)\//i;

export function getStreamProvider(userAgent = typeof navigator === "undefined" ? "" : navigator.userAgent) {
      return EDGE_USER_AGENT.test(userAgent) ? "vidcore" : "cinemaos";
}

export function getStreamUrl({ category, id, season, episode, provider = getStreamProvider() }) {
      if (provider === "vidcore") {
            return category === "tv"
                  ? `https://vidcore.io/tv/${id}/${season}/${episode}?autoPlay=true`
                  : `https://vidcore.io/movie/${id}?autoPlay=true`;
      }

      return category === "tv"
            ? `https://cinemaos.tech/watch/tv/${id}?season=${season}&episode=${episode}`
            : `https://cinemaos.tech/player/${id}`;
}
