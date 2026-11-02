import { memo, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clapperboard, Play, Star } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Autoplay from "embla-carousel-autoplay";
import { play } from "cuelume";
import api from "../../utils/axios";
import { Carousel, Slider, SliderContainer } from "./Carousal";
import { useCarouselSelection } from "./CarouselContext";
import MetalActionButton from "./MediaActionButton";

const HERO_LIMIT = 6;
const CAROUSEL_OPTIONS = { loop: true };
const NO_PLUGINS = [];

const HeroSlide = memo(function HeroSlide({ item, index }) {
      const { selectedIndex = 0 } = useCarouselSelection();
      const isActive = selectedIndex === index;
      const ActionButton = MetalActionButton;
      const title = item.original_title || item.title || item.original_name || item.name || "Untitled";
      const mediaType = item.media_type === "tv" ? "tv" : "movie";
      const year = (item.release_date || item.first_air_date || "").slice(0, 4);
      const artwork = item.backdrop_path || item.poster_path;
      const artworkSize = index === 0 ? "w1280" : "w780";

      return (
            <Slider className="w-full">
                  <div className="home-hero-slide">
                        <div className="hero-artwork" data-glisse-backdrop>
                              <img
                                    loading={index === 0 ? "eager" : "lazy"}
                                    decoding="async"
                                    width="1280"
                                    height="720"
                                    className="home-hero-image"
                                    src={artwork ? `https://image.tmdb.org/t/p/${artworkSize}${artwork}` : "/noImage.jpg"}
                                    alt=""
                              />
                        </div>
                        <div className="home-hero-content px-4 text-white">
                              <div className="w-full space-y-5 bg-transparent">
                                    <h1 className="text-3xl break-words h-fit font-semibold font-astralga lg:text-4xl min-[1150px]:text-5xl leading-none">{title}</h1>
                                    <div className="hero-media-actions" aria-label={`Watch or view trailer for ${title}`}>
                                          <ActionButton
                                                as={Link}
                                                to={`/${mediaType}/details/${item.id}/${mediaType === "tv" ? "watch/1/1" : "watch"}`}
                                                onClick={() => play("press")}
                                                label="Watch"
                                                icon={Play}
                                                primary
                                                paused={!isActive}
                                                className="hero-media-action"
                                          />
                                          <ActionButton
                                                as={Link}
                                                to={`/${mediaType}/details/${item.id}/trailer`}
                                                onClick={() => play("press")}
                                                label="Trailer"
                                                icon={Clapperboard}
                                                paused={!isActive}
                                                className="hero-media-action"
                                          />
                                    </div>
                                    <div className="hero-meta-row" aria-label="Title information">
                                          {Number(item.vote_average) > 0 && (
                                                <span className="hero-meta__rating">
                                                      <Star size={16} fill="currentColor" aria-hidden="true" />
                                                      <span>{Number(item.vote_average).toFixed(1)} / 10</span>
                                                </span>
                                          )}
                                          {year && <span className="hero-meta__item">{year}</span>}
                                          <span className="hero-meta__item">{mediaType === "tv" ? "TV series" : "Movie"}</span>
                                    </div>
                              </div>
                        </div>
                  </div>
            </Slider>
      );
});

const Header = () => {
      const [nowPlaying, setNowPlaying] = useState([]);
      const reducedMotion = useReducedMotion();
      const autoplay = useMemo(() => Autoplay({
            playOnInit: true,
            delay: 5000,
            stopOnMouseEnter: true,
            stopOnInteraction: true,
      }), []);
      const plugins = useMemo(() => reducedMotion ? NO_PLUGINS : [autoplay], [autoplay, reducedMotion]);

      useEffect(() => {
            const controller = new AbortController();
            api.get("trending/all/day", { signal: controller.signal })
                  .then(({ data }) => {
                        if (controller.signal.aborted) return;
                        const featured = (data.results || [])
                              .filter((item) => item.media_type === "movie" || item.media_type === "tv")
                              .slice(0, HERO_LIMIT);
                        setNowPlaying(featured);
                  })
                  .catch(() => {
                        if (!controller.signal.aborted) setNowPlaying([]);
                  });

            return () => controller.abort();
      }, []);

      return (
            <header className="w-full leading-none font-primary">
                  <section className="w-full flex relative">
                        <Carousel options={CAROUSEL_OPTIONS} className="w-full" plugins={plugins}>
                              <SliderContainer className="gap-0 cursor-grab">
                                    {nowPlaying.map((item, index) => (
                                          <HeroSlide key={`${item.media_type}-${item.id}`} item={item} index={index} />
                                    ))}
                              </SliderContainer>
                        </Carousel>
                  </section>
            </header>
      );
};

export default Header;
