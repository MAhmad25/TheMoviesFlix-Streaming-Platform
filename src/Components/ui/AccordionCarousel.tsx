import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const imageBase = "https://image.tmdb.org/t/p/w500";

export default function AccordionCarousel({ seasons = [], initialIndex = 0, onOpenSeason }) {
      const [active, setActive] = useState(initialIndex);
      const [paused, setPaused] = useState(false);
      const reducedMotion = useReducedMotion();

      useEffect(() => {
            setActive(Math.max(0, Math.min(initialIndex, seasons.length - 1)));
      }, [initialIndex, seasons.length]);

      useEffect(() => {
            if (paused || reducedMotion || seasons.length < 2) return undefined;
            const timer = window.setInterval(() => {
                  setActive((current) => (current + 1) % seasons.length);
            }, 4000);
            return () => window.clearInterval(timer);
      }, [active, paused, reducedMotion, seasons.length]);

      if (!seasons.length) return null;

      return (
            <section
                  className="season-carousel"
                  aria-label="TV seasons"
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  onFocus={() => setPaused(true)}
                  onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
                  }}
            >
                  <div className="season-carousel__panels">
                        {seasons.map((season, index) => {
                              const isActive = index === active;
                              const seasonNumber = Number(season.season_number) || 0;
                              const title = season.name || `Season ${seasonNumber}`;
                              const year = season.air_date?.slice(0, 4);
                              const episodeCount = Number(season.episode_count) || 0;
                              const poster = season.poster_path ? `${imageBase}${season.poster_path}` : "/noImage.jpg";

                              return (
                                    <motion.article
                                          key={season.id || season.season_number}
                                          className={`season-carousel__panel${isActive ? " is-active" : ""}`}
                                          initial={false}
                                          animate={{ flexGrow: isActive ? 5 : 1 }}
                                          transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 26 }}
                                          style={{ backgroundImage: `linear-gradient(180deg, rgb(20 5 3 / 4%) 20%, rgb(20 5 3 / 88%) 100%), url("${poster}")` }}
                                    >
                                          <button
                                                type="button"
                                                className="season-carousel__select"
                                                aria-label={`${isActive ? "Selected" : "Show"} ${title}`}
                                                aria-pressed={isActive}
                                                onClick={() => setActive(index)}
                                          />
                                          {!isActive && (
                                                <span className="season-carousel__collapsed-title" aria-hidden="true">{title}</span>
                                          )}
                                          <span className="season-carousel__number" aria-hidden="true">
                                                {String(seasonNumber).padStart(2, "0")}
                                          </span>
                                          {isActive && (
                                                <motion.div
                                                      className="season-carousel__caption"
                                                      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                                                      animate={{ opacity: 1, y: 0 }}
                                                      transition={{ duration: reducedMotion ? 0 : 0.25, delay: reducedMotion ? 0 : 0.12 }}
                                                >
                                                      <h3>{title}</h3>
                                                      <p>{episodeCount} {episodeCount === 1 ? "episode" : "episodes"}{year ? ` · ${year}` : ""}</p>
                                                      <button type="button" className="season-carousel__cta" onClick={() => onOpenSeason?.(season)}>
                                                            View season
                                                      </button>
                                                </motion.div>
                                          )}
                                    </motion.article>
                              );
                        })}
                  </div>
            </section>
      );
}
