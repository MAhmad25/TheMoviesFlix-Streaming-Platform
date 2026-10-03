import ReactPlayer from "react-player";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { NotFound } from "../ui/index";
import useFullScreen from "../../hooks/useFullScreen";
import { MdClose } from "react-icons/md";
import { getContentProperties, getRouteContext } from "../../analytics/events.js";
import { captureEvent } from "../../analytics/posthog.js";

const Trailer = () => {
      useFullScreen();
      const navigate = useNavigate();
      const { pathname } = useLocation();
      const isMovie = pathname.includes("movie") ? "movie" : "tv";
      const info = useSelector((state) => state[isMovie].info);
      const video = info?.videoLink;
      const playback = useRef({ key: null, events: new Set() });

      const trackPlayback = (event, extra = {}) => {
            const properties = getContentProperties(getRouteContext(pathname), info);
            if (!video || !properties) return;
            const key = `${pathname}:${video.key}`;
            if (playback.current.key !== key) playback.current = { key, events: new Set() };
            const eventKey = `${event}:${extra.progress_percent || ""}`;
            if (playback.current.events.has(eventKey)) return;
            playback.current.events.add(eventKey);
            captureEvent(event, { ...properties, trailer_id: video.key, player_provider: "youtube", ...extra });
      };
      return (
            <section
                  style={{
                        backgroundImage: "radial-gradient(transparent 1px, #14120b 1px)",
                        backgroundSize: "3px 3px",
                        backdropFilter: "brightness(1) blur(10px)",
                        willChange: "filter, opacity, transform",
                  }}
                  className="w-full fixed no-scroll inset-0 z-50  h-[92dvh] md:h-screen  flex justify-center items-center"
            >
                  <span onClick={() => navigate(-1)} className="fixed cursor-pointer z-10 bg-white/30 backdrop-blur md:scale-110 rounded-full p-2 top-3 right-3">
                        <div>
                              <MdClose size="1.5rem" color="black" />
                        </div>
                  </span>
                  {video ? (
                        <div className="w-[95%] h-[95%]  overflow-hidden rounded-xl">
                              <ReactPlayer
                                    controls={true}
                                    url={`https://www.youtube.com/watch?v=${video.key}`}
                                    height="100%"
                                    width="100%"
                                    onStart={() => trackPlayback("trailer_started")}
                                    onProgress={({ played }) => {
                                          [25, 50, 75].forEach((percent) => {
                                                if (played * 100 >= percent) trackPlayback("trailer_progress", { progress_percent: percent });
                                          });
                                    }}
                                    onEnded={() => trackPlayback("trailer_completed")}
                                    onError={() => trackPlayback("trailer_error")}
                              />
                        </div>
                  ) : (
                        <NotFound />
                  )}
            </section>
      );
};

export default Trailer;
