import { play } from "cuelume";
import { memo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StarIcon from "./Icons/StarIcon";

const Card = ({ eachMovie, type = "all" }) => {
      const navigate = useNavigate();
      const isDragging = useRef(false);
      const tmdbPath = eachMovie.poster_path || eachMovie.backdrop_path || eachMovie.profile_path || null;
      const displaySrc = tmdbPath ? `https://image.tmdb.org/t/p/w500${tmdbPath}` : "/noImage.jpg";
      const handleClick = () => {
            if (isDragging.current) return;
            play("press");
            navigate(`/${eachMovie.media_type || type}/details/${eachMovie.id}`);
      };

      return (
            <div
                  onMouseEnter={() => play("whisper", { volume: 0.6 })}
                  onClick={handleClick}
                  onMouseDown={() => (isDragging.current = false)}
                  onMouseMove={() => (isDragging.current = true)}
                  onMouseUp={() => setTimeout(() => (isDragging.current = false), 100)}
                  className="media-card w-full min-w-0 h-full shrink-0 rounded-xl overflow-hidden"
                  style={{
                        backgroundColor: "#0f0000",
                  }}
            >
                  <div className="px-3 pb-1 flex flex-col gap-1.5">
                        {eachMovie.vote_average !== 0 && (
                              <div className="flex items-center justify-end gap-2">
                                    {eachMovie.vote_average > 0 && (
                                          <>
                                                <StarIcon />
                                                <span className="text-xs font-medium tracking-tight leading-none" style={{ color: "#fefefe" }}>
                                                      {eachMovie.vote_average.toFixed(1)}
                                                </span>
                                          </>
                                    )}
                              </div>
                        )}
                  </div>
                  <section className="w-full relative overflow-hidden sm:h-56 md:h-72 h-40">
                        <img loading="lazy" decoding="async" className={`w-full h-full object-cover pointer-events-none `} src={displaySrc} alt={eachMovie.name || eachMovie.title || eachMovie.original_title} />
                        <div
                              className="absolute inset-x-0  top-0 h-16 pointer-events-none"
                              style={{
                                    background: `linear-gradient(to top, transparent, #0f0000)`,
                              }}
                        />
                  </section>
            </div>
      );
};
export default memo(Card);
