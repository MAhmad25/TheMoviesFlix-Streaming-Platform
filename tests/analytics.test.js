import assert from "node:assert/strict";
import test from "node:test";
import { getAnalyticsConfig } from "../src/analytics/config.js";
import { getContentProperties, getRouteContext } from "../src/analytics/events.js";

const production = { PROD: true, VITE_POSTHOG_PROJECT_TOKEN: "phc_test" };

test("production analytics uses the project host and leaves pageviews to the router", () => {
      const config = getAnalyticsConfig({ ...production, VITE_POSTHOG_HOST: "https://eu.i.posthog.com" });
      assert.equal(config.options.api_host, "https://eu.i.posthog.com");
      assert.equal(config.options.capture_pageview, false);
      assert.equal(config.options.capture_pageleave, true);
      assert.equal(config.options.person_profiles, "identified_only");
});

test("missing keys, disabled analytics, and normal development never initialize tracking", () => {
      assert.equal(getAnalyticsConfig({ PROD: true }), null);
      assert.equal(getAnalyticsConfig({ ...production, VITE_POSTHOG_ENABLED: "false" }), null);
      assert.equal(getAnalyticsConfig({ ...production, PROD: false }), null);
      assert.ok(getAnalyticsConfig({ ...production, PROD: false, VITE_POSTHOG_CAPTURE_IN_DEV: "true" }));
});

test("session replay is opt-in and masks input values", () => {
      assert.equal(getAnalyticsConfig(production).options.disable_session_recording, true);
      const config = getAnalyticsConfig({ ...production, VITE_POSTHOG_SESSION_REPLAY: "true" });
      assert.equal(config.options.disable_session_recording, false);
      assert.equal(config.options.session_recording.maskAllInputs, true);
      assert.equal(config.options.session_recording.recordBody, false);
});

test("each real route has the right category and nested routes do not count as detail views", () => {
      const cases = [
            ["/", "home", undefined],
            ["/trending", "movies", undefined],
            ["/tv", "tv_shows", undefined],
            ["/search", "search", undefined],
            ["/people", "people", undefined],
            ["/movie/details/550", "movie_details", "movie_viewed"],
            ["/movie/details/550/watch", "movie_watch", "watch_opened"],
            ["/movie/details/550/trailer", "movie_trailer", "trailer_opened"],
            ["/tv/details/1399", "tv_details", "tv_show_viewed"],
            ["/tv/details/1399/watch/2/3", "tv_watch", "watch_opened"],
            ["/tv/details/1399/trailer", "tv_trailer", "trailer_opened"],
            ["/person/details/287", "person_details", "person_viewed"],
            ["/movie/details/550/invalid", "not_found", undefined],
      ];
      cases.forEach(([pathname, name, event]) => {
            const route = getRouteContext(pathname);
            assert.equal(route.properties.route_name, name, pathname);
            assert.equal(route.event, event, pathname);
      });
});

test("TV seasonID is captured as an episode number, including season zero", () => {
      const { properties } = getRouteContext("/tv/details/1399/watch/0/3");
      assert.equal(properties.route_pattern, "/tv/details/:id/watch/:season/:seasonID");
      assert.equal(properties.content_id, "1399");
      assert.equal(properties.season_number, 0);
      assert.equal(properties.episode_number, 3);
});

test("unloaded or stale Redux details cannot label a visit with the wrong movie", () => {
      const route = getRouteContext("/movie/details/550/watch");
      assert.equal(getContentProperties(route, null), null);
      assert.equal(getContentProperties(route, { detail: { id: 551, title: "Wrong movie" } }), null);
      const properties = getContentProperties(route, { detail: { id: 550, title: "Fight Club", release_date: "1999-10-15", genres: [{ name: "Drama" }] } });
      assert.equal(properties.content_title, "Fight Club");
      assert.equal(properties.release_year, "1999");
      assert.deepEqual(properties.genres, ["Drama"]);
});

test("TV titles and people use their actual TMDB field names", () => {
      const tv = getContentProperties(getRouteContext("/tv/details/1399"), { detail: { id: 1399, name: "Game of Thrones", first_air_date: "2011-04-17" } });
      assert.equal(tv.content_title, "Game of Thrones");
      assert.equal(tv.release_year, "2011");
      const person = getContentProperties(getRouteContext("/person/details/287"), { personDetail: { id: 287, name: "Brad Pitt" } });
      assert.equal(person.content_title, "Brad Pitt");
      assert.equal(person.release_year, undefined);
});
