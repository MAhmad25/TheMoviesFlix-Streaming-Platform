import ReactPlayer from "react-player";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import useFullScreen from "../../hooks/useFullScreen";
import { MdClose } from "react-icons/md";
import { getContentProperties, getRouteContext } from "../../analytics/events.js";
import { captureEvent } from "../../analytics/posthog.js";

const Trailer = () => {
      useFullScreen();
      const navigate = useNavigate();
      const location = useLocation();
      const { pathname } = location;
      const isMovie = pathname.includes("movie") ? "movie" : "tv";
      const info = useSelector((state) => state[isMovie].info);
      const seasonNumber = location.state?.seasonNumber;
      const video = location.state?.video || info?.videoLink;
      const [playerState, setPlayerState] = useState("loading");
      const playback = useRef({ key: null, events: new Set() });

      useEffect(() => {
            setPlayerState(video?.key ? "loading" : "unavailable");
      }, [video?.key]);

      const trackPlayback = (event, extra = {}) => {
            const properties = getContentProperties(getRouteContext(pathname), info);
            if (!video || !properties) return;
            const key = `${pathname}:${seasonNumber ?? "series"}:${video.key}`;
            if (playback.current.key !== key) playback.current = { key, events: new Set() };
            const eventKey = `${event}:${extra.progress_percent || ""}`;
            if (playback.current.events.has(eventKey)) return;
            playback.current.events.add(eventKey);
            captureEvent(event, {
                  ...properties,
                  trailer_id: video.key,
                  player_provider: "youtube",
                  ...(seasonNumber !== undefined && { season_number: seasonNumber }),
                  ...(location.state?.trailerScope && { trailer_scope: location.state.trailerScope }),
                  ...extra,
            });
      };
      return (
            <section className="trailer-overlay fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8" aria-label={seasonNumber === undefined ? "Trailer player" : `Season ${seasonNumber} trailer player`}>
                  <button type="button" onClick={() => navigate(-1)} aria-label="Close trailer" className="trailer-overlay__close">
                        <MdClose size="1.5rem" />
                  </button>
                  <h1 className="sr-only">{seasonNumber === undefined ? "Trailer" : `Season ${seasonNumber} trailer`}</h1>
                  {video ? (
                        <div className="trailer-player-shell">
                              <ReactPlayer
                                    controls={true}
                                    playsInline
                                    url={`https://www.youtube.com/watch?v=${video.key}`}
                                    height="100%"
                                    width="100%"
                                    onReady={() => setPlayerState("ready")}
                                    onStart={() => {
                                          setPlayerState("ready");
                                          trackPlayback("trailer_started");
                                    }}
                                    onProgress={({ played }) => {
                                          [25, 50, 75].forEach((percent) => {
                                                if (played * 100 >= percent) trackPlayback("trailer_progress", { progress_percent: percent });
                                          });
                                    }}
                                    onEnded={() => trackPlayback("trailer_completed")}
                                    onError={() => {
                                          setPlayerState("error");
                                          trackPlayback("trailer_error");
                                    }}
                              />
                              {playerState === "loading" && <div className="trailer-player-status" role="status">Loading trailer…</div>}
                              {playerState === "error" && <div className="trailer-player-status" role="alert">This trailer could not be played. Close the player to return to the series.</div>}
                        </div>
                  ) : (
                        <div className="trailer-player-status trailer-player-status--unavailable" role="status">No YouTube trailer is listed for this title.</div>
                  )}
            </section>
      );
};

export default Trailer;
