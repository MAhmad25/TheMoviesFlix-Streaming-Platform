import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useLocation } from "react-router-dom";
import "./tilt-slide-transition.css";

// Adapted from @soralabs/tilt-slide-transition for the existing React Router tree.
export function TiltSlideTransition({ children }) {
      const location = useLocation();
      const [displayedLocation, setDisplayedLocation] = useState(location);
      const previousLocation = useRef(location);

      useEffect(() => {
            if (previousLocation.current === location) return;

            const previous = previousLocation.current;
            previousLocation.current = location;
            const sameUrl = previous.pathname === location.pathname && previous.search === location.search && previous.hash === location.hash;

            if (sameUrl || typeof document.startViewTransition !== "function" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                  setDisplayedLocation(location);
                  return;
            }

            let cancelled = false;
            let transition;
            try {
                  // Keep the old route mounted until the browser captures its snapshot.
                  transition = document.startViewTransition(() => {
                        if (!cancelled) flushSync(() => setDisplayedLocation(location));
                  });
                  // A skipped/interrupted transition must never block navigation.
                  transition.finished.catch(() => {});
            } catch {
                  setDisplayedLocation(location);
            }

            return () => {
                  cancelled = true;
                  transition?.skipTransition();
            };
      }, [location]);

      return children(displayedLocation);
}
