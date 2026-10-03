# MoviesFlix analytics

MoviesFlix uses PostHog's browser SDK. Login is not required: the SDK assigns a persistent anonymous browser ID and includes session, referrer, campaign, device, browser, and location information. Unique visitors are browser identities, not an exact count of people across devices. Clearing browser storage or using another browser creates another identity. Tracking starts after deployment; it cannot recover earlier traffic.

## Activate on Vercel

The supplied public project token and US host are configured locally in the ignored `.env.local` file. In your Vercel project's **Settings → Environment Variables**, copy these two values into the Production environment:

```env
VITE_POSTHOG_PROJECT_TOKEN=<your public phc_ project token>
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

Deploy the updated code, or redeploy after setting the variables. Vite embeds these values at build time. Use the public project token, never a PostHog personal API key. Analytics safely stays disabled when the token is missing.

## Where to see your traffic

Open the correct MoviesFlix project in [PostHog US](https://us.posthog.com), then:

1. **Web Analytics** shows unique visitors, sessions, pageviews, top pages, entry/exit pages, traffic sources, countries, device types, bounce rate, and session duration.
2. **Activity** shows incoming events. Open the site and navigate to a detail, trailer, and watch route to verify the events below.
3. **Product Analytics → Insights** gives title rankings, trends, funnels, retention, and paths. Add the relevant insights to a dashboard named **MoviesFlix overview**.

For production reporting, filter on `app_name = MoviesFlix` and `app_environment = production`. Development validation events use `app_environment = development` and can be excluded. Set the project's reporting timezone to your preferred timezone (for example, Asia/Karachi).

Suggested dashboard (start with the last 30 days):

| Question | Event and aggregation | Breakdown / view |
| --- | --- | --- |
| How many visitors? | `$pageview`, unique users | Daily trend; also compare total pageviews |
| Which routes are most popular? | `$pageview`, unique users or total events | `route_name` or `route_pattern`, table |
| Which movies are visited? | `movie_viewed`, unique users | `content_title`, table |
| Which TV shows are visited? | `tv_show_viewed`, unique users | `content_title`, table |
| How many visitors open watch pages? | `watch_opened`, unique users | `content_title`, optionally `content_type` |
| Which TV episodes are opened? | `watch_opened`, filter `content_type = tv` | `content_title`, `season_number`, `episode_number` |
| How many visitors open trailers? | `trailer_opened`, unique users | `content_title`; `trailer_available` distinguishes missing trailers |
| How many actually start a trailer? | `trailer_started`, unique users | `content_title` |
| Where do trailer viewers stop? | `trailer_progress` and `trailer_completed` | `progress_percent` / funnel |
| Do searches lead to content? | `search_performed` → `search_result_selected` | Funnel |
| Do movie visitors open a watch page? | `movie_viewed` → `watch_opened`, filter `content_type = movie` | Funnel; hold `content_id` constant |
| Do visitors come back? | `$pageview` → `$pageview` | Retention |
| What journey do visitors take? | `$pageview` | Paths, grouped by `route_name` |

Use **unique users** for visitors and **total events** for opens/views. A returning visitor can open the same page several times. `route_pattern` groups all movies together (for example `/movie/details/:id/watch`); `$pathname` retains the exact URL. A detail event only fires on the detail route: opening its nested trailer/watch overlay does not add another detail view. Direct links to watch/trailer pages still count.

## Event reference

| Event | When it fires | Extra properties |
| --- | --- | --- |
| `$pageview` | Initial page and each router navigation, including back/forward | `route_name`, `route_pattern`, `$pathname`, `navigation_type`; content ID/type and TV season/episode when present |
| `movie_viewed`, `tv_show_viewed`, `person_viewed` | Matching details have loaded on the detail route | `content_id`, `content_type`, `content_title`, `genres`, `release_year` (last two for movies/TV) |
| `watch_opened` | Watch route's matching content has loaded | Content properties; `player_provider = cinemaos`; TV season/episode |
| `trailer_opened` | Trailer route's matching content has loaded | Content properties; `trailer_available` |
| `trailer_started` | Trailer playback starts for the first time in that opening | Content properties, `trailer_id`, `player_provider = youtube` |
| `trailer_progress` | Trailer playhead first reaches 25%, 50%, or 75% | Trailer properties, `progress_percent` |
| `trailer_completed` | Trailer reaches its end | Trailer properties |
| `trailer_error` | Trailer player reports an error | Trailer properties (no raw error payload) |
| `search_performed` | Latest debounced search succeeds | `query_length`, `result_count`, `has_results` |
| `search_failed` | Latest debounced search fails | `query_length` |
| `search_result_selected` | A search suggestion is selected | Selected content ID/type/title |

PostHog also captures interaction events, page leaves, browser exceptions, and web vitals. Pageviews are sent centrally instead of enabling both automatic and manual pageview tracking. Content events wait for matching Redux data so old movie titles cannot contaminate a new route. If content fails to load, the route still has a pageview, but no successful content-open event.

Search text is not sent in custom events; only its length and result counts are sent. Trailer progress measures playhead milestones, so seeking can cross a milestone. The third-party watch iframe does not expose playback callbacks: `watch_opened` measures opening the watch route, not confirmed playback, completion, or watch duration. Analytics blockers and blocked network requests can reduce observed traffic.

## Optional replay and local validation

Session replay is off by default. To enable it, set `VITE_POSTHOG_SESSION_REPLAY=true`, enable **Record user sessions** in PostHog's project settings, and rebuild. Inputs are masked; network bodies, headers, and console recording are disabled. Replays cover your app, not playback inside a third-party iframe.

For a local delivery check, temporarily set `VITE_POSTHOG_CAPTURE_IN_DEV=true` in `.env.local` and restart `npm run dev`. Those events are tagged as development. Restore it to `false` afterward. `VITE_POSTHOG_ENABLED=false` disables all tracking on the next build.

Run `npm run test:analytics` for route attribution and configuration checks, and `npm run build` for production compilation.
