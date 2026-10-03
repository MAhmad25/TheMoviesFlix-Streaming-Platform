export function getAnalyticsConfig(env) {
      const token = env.VITE_POSTHOG_PROJECT_TOKEN?.trim();
      const enabled = env.VITE_POSTHOG_ENABLED !== "false" && (env.PROD || env.VITE_POSTHOG_CAPTURE_IN_DEV === "true");

      if (!enabled || !token?.startsWith("phc_")) return null;

      return {
            token,
            options: {
                  api_host: env.VITE_POSTHOG_HOST?.trim() || "https://us.i.posthog.com",
                  defaults: "2026-05-30",
                  // React Router owns pageviews, including nested watch/trailer routes.
                  capture_pageview: false,
                  capture_pageleave: true,
                  autocapture: true,
                  person_profiles: "identified_only",
                  persistence: "localStorage+cookie",
                  capture_exceptions: true,
                  capture_performance: { web_vitals: true, network_timing: false },
                  disable_session_recording: env.VITE_POSTHOG_SESSION_REPLAY !== "true",
                  session_recording: { maskAllInputs: true, recordHeaders: false, recordBody: false },
                  enable_recording_console_log: false,
            },
      };
}
