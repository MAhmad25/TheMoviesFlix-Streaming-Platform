import posthog from "posthog-js";
import { getAnalyticsConfig } from "./config.js";
import { getRouteContext } from "./events.js";

let initialized = false;
let enabled = false;
const pendingEvents = [];

export function initializeAnalytics() {
      if (enabled) return;
      const config = getAnalyticsConfig(import.meta.env);
      if (!config) return;
      enabled = true;

      try {
            posthog.init(config.token, {
                  ...config.options,
                  loaded: (client) => {
                        client.register({ app_name: "MoviesFlix", app_environment: import.meta.env.MODE });
                        initialized = true;
                        pendingEvents.splice(0).forEach(({ event, properties, timestamp }) => {
                              sendEvent(event, properties, timestamp);
                        });
                  },
            });
      } catch {
            enabled = false;
            pendingEvents.length = 0;
            // Analytics must never prevent the application from rendering.
            if (import.meta.env.DEV) console.warn("MoviesFlix analytics could not initialize.");
      }
}

export function captureEvent(event, properties = {}) {
      if (!enabled) return;
      const context = {
            ...getRouteContext(window.location.pathname).properties,
            $current_url: window.location.href,
            ...properties,
      };
      if (!initialized) {
            // Preserve the first pageview while SDK extensions finish loading.
            if (pendingEvents.length < 100) pendingEvents.push({ event, properties: context, timestamp: new Date() });
            return;
      }
      sendEvent(event, context);
}

function sendEvent(event, properties, timestamp) {
      try {
            posthog.capture(event, properties, timestamp ? { timestamp } : undefined);
      } catch {
            // Keep navigation and playback working if the SDK is unavailable.
      }
}
