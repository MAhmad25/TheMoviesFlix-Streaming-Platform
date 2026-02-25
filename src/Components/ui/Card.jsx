import { memo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageLoader } from "./index";
import { AnimatePresence, motion } from "motion/react";

const Card = ({ eachMovie, type = "all" }) => {
      const [showSkeleton, setSkeleton] = useState(true);
      const navigate = useNavigate();
      const isDragging = useRef(false);

      const tmdbPath = eachMovie.backdrop_path || eachMovie.poster_path || eachMovie.profile_path || null;

      const displaySrc = tmdbPath ? `https://image.tmdb.org/t/p/original${tmdbPath}` : "/noImage.jpg";
      const handleClick = () => {
            if (!isDragging.current) {
                  navigate(`/${eachMovie.media_type || type}/details/${eachMovie.id}`);
            }
      };

      return (
            <div
                  onClick={handleClick}
                  onMouseDown={() => (isDragging.current = false)}
                  onMouseMove={() => (isDragging.current = true)}
                  onMouseUp={() => setTimeout(() => (isDragging.current = false), 100)}
                  className="w-44 sm:w-56 h-full md:w-full shrink-0 rounded-xl overflow-hidden"
                  style={{
                        backgroundColor: "#0f0000",
                        transition: "background-color 0.6s ease",
                  }}
            >
                  <section className="w-full relative overflow-hidden sm:h-56 md:h-72 h-40">
                        <AnimatePresence>{showSkeleton && <ImageLoader />}</AnimatePresence>
                        <motion.img loading="lazy" decoding="async" whileHover={{ scale: 1.08, transition: { ease: "circInOut", duration: 0.4 } }} onLoad={() => setSkeleton(false)} className={`w-full h-full object-cover pointer-events-none ${showSkeleton ? "invisible" : "visible"}`} src={displaySrc} alt={eachMovie.name || eachMovie.title || eachMovie.original_title} />
                        <div
                              className="absolute inset-x-0  bottom-0 h-16 pointer-events-none"
                              style={{
                                    background: `linear-gradient(to bottom, transparent, #0f0000)`,
                                    transition: "background 0.6s ease",
                              }}
                        />
                  </section>

                  <div className="px-3 pb-3 pt-1.5 flex flex-col gap-1.5">
                        {eachMovie.vote_average !== 0 && (
                              <div className="flex items-center justify-between gap-2">
                                    {eachMovie.vote_average > 0 && (
                                          <span className="text-xs font-medium tracking-tight leading-none" style={{ color: "#fefefe", transition: "color 0.5s ease" }}>
                                                ⭐ {eachMovie.vote_average.toFixed(1)}
                                          </span>
                                    )}
                                    {eachMovie?.release_date && (
                                          <span
                                                className="text-xs font-semibold tracking-tight leading-none px-2.5 py-1 rounded-full"
                                                style={{
                                                      backgroundColor: "#0f0000",
                                                      color: "#fefefe",
                                                      transition: "background-color 0.6s ease, color 0.6s ease",
                                                }}
                                          >
                                                {eachMovie.release_date.split("-")[0]}
                                          </span>
                                    )}
                              </div>
                        )}

                        <h3 className="w-full text-wrap leading-none text-sm sm:text-[1.2rem] tracking-tight" style={{ color: "#fafafa", transition: "color 0.5s ease" }}>
                              {eachMovie.name || eachMovie.title || eachMovie.original_title}
                        </h3>
                  </div>
            </div>
      );
};
export default memo(Card);
