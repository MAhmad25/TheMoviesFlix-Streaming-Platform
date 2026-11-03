import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, CirclePlay, Clapperboard, Play, SquarePlay, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { play } from "cuelume";
import MediaActionButton from "../../Components/ui/MediaActionButton";

const STRIP_COUNT = 8;
const EASE = [0.65, 0, 0.35, 1] as const;
const AUTOPLAY_DELAY = 5000;

const stripVariants = (strip: number) => ({
      enter: (direction: number) => ({ y: direction > 0 ? "102%" : "-102%" }),
      center: {
            y: "0%",
            transition: { duration: 0.7, ease: EASE, delay: strip * 0.055 },
      },
      exit: (direction: number) => ({
            y: direction > 0 ? "-102%" : "102%",
            transition: { duration: 0.7, ease: EASE, delay: strip * 0.055 },
      }),
});

export default function SlicedRevealCarousel({ slides = [] }) {
      const [[index, direction], setState] = useState([0, 1]);
      const [paused, setPaused] = useState(false);
      const reducedMotion = useReducedMotion();

      const paginate = useCallback((amount) => {
            setState(([current]) => [
                  (current + amount + slides.length) % slides.length,
                  amount,
            ]);
      }, [slides.length]);

      useEffect(() => {
            if (slides.length < 2 || paused || reducedMotion) return undefined;
            const timer = window.setInterval(() => paginate(1), AUTOPLAY_DELAY);
            return () => window.clearInterval(timer);
      }, [index, paginate, paused, reducedMotion, slides.length]);

      if (!slides.length) return null;

      const activeIndex = index % slides.length;
      const slide = slides[activeIndex];
      const imageStyle = (strip) => ({
            backgroundImage: slide.imageUrl
                  ? `url("${slide.imageUrl}")`
                  : "linear-gradient(135deg, #300b07, #631a0e)",
            backgroundPosition: `${(strip / (STRIP_COUNT - 1)) * 100}% center`,
            backgroundSize: `${STRIP_COUNT * 100}% 100%`,
      });

      return (
            <section
                  className="sliced-hero"
                  aria-label="Featured titles"
                  aria-roledescription="carousel"
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  onKeyDown={(event) => {
                        if (event.key === "ArrowLeft") {
                              event.preventDefault();
                              paginate(-1);
                        }
                        if (event.key === "ArrowRight") {
                              event.preventDefault();
                              paginate(1);
                        }
                  }}
            >
                  <div className="home-hero-slide">
                        <div className="hero-artwork" aria-hidden="true">
                              <AnimatePresence initial={false} custom={direction}>
                                    <motion.div
                                          key={slide.id}
                                          className="sliced-hero__image-layer"
                                          custom={direction}
                                          initial={reducedMotion ? false : "enter"}
                                          animate="center"
                                          exit={reducedMotion ? undefined : "exit"}
                                          aria-hidden="true"
                                    >
                                          {Array.from({ length: STRIP_COUNT }, (_, strip) => (
                                                <motion.div
                                                      key={strip}
                                                      className="sliced-hero__strip"
                                                      custom={direction}
                                                      variants={stripVariants(strip)}
                                                      style={imageStyle(strip)}
                                                />
                                          ))}
                                    </motion.div>
                              </AnimatePresence>
                        </div>

                        <div className="home-hero-content px-4 text-white">
                              <div className="sliced-hero__copy">
                                    <p className="sliced-hero__eyebrow">Trending today</p>
                                    <h1 className="sliced-hero__title">{slide.title}</h1>
                                    <div className="hero-media-actions" aria-label={`Actions for ${slide.title}`}>
                                          <MediaActionButton
                                                as={Link}
                                                to={slide.watchTo}
                                                onClick={() => play("press")}
                                                label="Watch"
                                                icon={Play}
                                                activeIcon={CirclePlay}
                                                primary
                                                className="hero-media-action"
                                          />
                                          <MediaActionButton
                                                as={Link}
                                                to={slide.trailerTo}
                                                onClick={() => play("press")}
                                                label="Trailer"
                                                icon={Clapperboard}
                                                activeIcon={SquarePlay}
                                                className="hero-media-action"
                                          />
                                    </div>
                                    <div className="hero-meta-row" aria-label="Title information">
                                          {Number(slide.rating) > 0 && (
                                                <span className="hero-meta__rating">
                                                      <Star size={16} fill="currentColor" aria-hidden="true" />
                                                      <span>{Number(slide.rating).toFixed(1)} / 10</span>
                                                </span>
                                          )}
                                          {slide.year && <span className="hero-meta__item">{slide.year}</span>}
                                          {slide.mediaLabel && <span className="hero-meta__item">{slide.mediaLabel}</span>}
                                    </div>
                              </div>
                        </div>
                  </div>

                  {slides.length > 1 && (
                        <div className="sliced-hero__controls">
                              <div className="sliced-hero__arrows">
                                    <button type="button" aria-label="Previous featured title" onClick={() => paginate(-1)}>
                                          <ChevronLeft size={18} aria-hidden="true" />
                                    </button>
                                    <button type="button" aria-label="Next featured title" onClick={() => paginate(1)}>
                                          <ChevronRight size={18} aria-hidden="true" />
                                    </button>
                              </div>
                        </div>
                  )}
            </section>
      );
}
