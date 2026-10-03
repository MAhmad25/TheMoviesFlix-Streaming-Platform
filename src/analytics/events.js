import { matchRoutes } from "react-router-dom";

const routes = [
      { path: "/", name: "home" },
      { path: "/trending", name: "movies" },
      { path: "/tv", name: "tv_shows" },
      { path: "/search", name: "search" },
      { path: "/people", name: "people" },
      { path: "/movie/details/:id", name: "movie_details", type: "movie", event: "movie_viewed" },
      { path: "/movie/details/:id/watch", name: "movie_watch", type: "movie", event: "watch_opened" },
      { path: "/movie/details/:id/trailer", name: "movie_trailer", type: "movie", event: "trailer_opened" },
      { path: "/tv/details/:id", name: "tv_details", type: "tv", event: "tv_show_viewed" },
      { path: "/tv/details/:id/watch/:season/:seasonID", name: "tv_watch", type: "tv", event: "watch_opened" },
      { path: "/tv/details/:id/trailer", name: "tv_trailer", type: "tv", event: "trailer_opened" },
      { path: "/person/details/:id", name: "person_details", type: "person", event: "person_viewed" },
      { path: "*", name: "not_found" },
];

export function getRouteContext(pathname) {
      const match = matchRoutes(routes, pathname)?.[0];
      const properties = {
            route_name: match?.route.name || "not_found",
            route_pattern: match?.route.path || "*",
            $pathname: pathname,
      };

      if (match?.route.type) {
            properties.content_type = match.route.type;
            properties.content_id = match.params.id;
      }
      if (match?.params.season !== undefined) properties.season_number = Number(match.params.season);
      // The existing router calls its episode parameter seasonID.
      if (match?.params.seasonID !== undefined) properties.episode_number = Number(match.params.seasonID);

      return { event: match?.route.event, properties };
}

export function getContentProperties(route, info) {
      const { content_type, content_id } = route.properties;
      const detail = content_type === "person" ? info?.personDetail : info?.detail;
      // Redux can briefly contain the previous title while a new route loads.
      if (!detail || String(detail.id) !== content_id) return null;

      return {
            ...route.properties,
            content_title: detail.title || detail.name || detail.original_title || detail.original_name || "Untitled",
            ...(content_type !== "person" && {
                  genres: detail.genres?.map((genre) => genre.name) || [],
                  release_year: (detail.release_date || detail.first_air_date || "").slice(0, 4),
            }),
      };
}
