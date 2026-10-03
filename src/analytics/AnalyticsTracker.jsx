import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigationType } from "react-router-dom";
import { getContentProperties, getRouteContext } from "./events.js";
import { captureEvent } from "./posthog.js";

export default function AnalyticsTracker() {
      const location = useLocation();
      const navigationType = useNavigationType();
      const route = useMemo(() => getRouteContext(location.pathname), [location.pathname]);
      const info = useSelector((state) => state[route.properties.content_type === "person" ? "people" : route.properties.content_type]?.info);
      const lastPageview = useRef(null);
      const lastContentVisit = useRef(null);
      const visit = `${location.key}:${location.pathname}${location.search}`;

      useEffect(() => {
            if (lastPageview.current === visit) return;
            lastPageview.current = visit;
            lastContentVisit.current = null;
            captureEvent("$pageview", {
                  ...route.properties,
                  $current_url: `${window.location.origin}${location.pathname}${location.search}`,
                  navigation_type: navigationType.toLowerCase(),
            });
      }, [visit, route, location.pathname, location.search, navigationType]);

      useEffect(() => {
            if (!route.event || lastContentVisit.current === visit) return;
            const properties = getContentProperties(route, info);
            if (!properties) return;

            lastContentVisit.current = visit;
            captureEvent(route.event, {
                  ...properties,
                  ...(route.event === "watch_opened" && { player_provider: "cinemaos" }),
                  ...(route.event === "trailer_opened" && { trailer_available: Boolean(info?.videoLink) }),
            });
      }, [visit, route, info]);

      return null;
}
