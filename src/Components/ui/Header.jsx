import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
      CirclePlay,
      Clapperboard,
      Play,
      SquarePlay,
      Star,
      ChevronLeft,
      ChevronRight,
      Flame,
} from "lucide-react";
import { play } from "cuelume";
import api from "../../utils/axios";
import { completeHomeLoad } from "../../utils/initialLoad";
import {
      Carousel,
      CarouselContent,
      CarouselSlide,
      CarouselPrev,
      CarouselNext,
      CarouselPagination,
} from "./carousel";
import MediaActionButton from "./MediaActionButton";

const HERO_LIMIT = 10;
const PARALLAX_FACTOR = 1.8;

function toHeroSlide(item) {
      const mediaType = item.media_type === "tv" ? "tv" : "movie";
      const title = item.original_title || item.title || item.original_name || item.name || "Untitled";
      const year = (item.release_date || item.first_air_date || "").slice(0, 4);
      const artwork = item.backdrop_path || item.poster_path;
      const imageUrl = artwork ? `https://image.tmdb.org/t/p/w1280${artwork}` : "";

      return {
            id: `${mediaType}-${item.id}`,
            itemId: item.id,
            title,
            year,
            mediaType,
            mediaLabel: mediaType === "tv" ? "TV Series" : "Movie",
            rating: item.vote_average,
            overview: item.overview || "",
            imageUrl,
            src: imageUrl || "/noImage.jpg",
            alt: `${title} backdrop`,
            label: "Trending today",
            watchTo: `/${mediaType}/details/${item.id}/${mediaType === "tv" ? "watch/1/1" : "watch"}`,
            trailerTo: `/${mediaType}/details/${item.id}/trailer`,
      };
}

const Header = () => {
      const [slides, setSlides] = useState([]);
      const [apiInstance, setApiInstance] = useState(null);
      const [selectedIndex, setSelectedIndex] = useState(0);

      useEffect(() => {
            const controller = new AbortController();
            api.get("trending/all/day", { signal: controller.signal })
                  .then(({ data }) => {
                        if (controller.signal.aborted) return;
                        const featured = (data.results || [])
                              .filter((item) => item.media_type === "movie" || item.media_type === "tv")
                              .slice(0, HERO_LIMIT)
                              .map(toHeroSlide);
                        setSlides(featured);
                  })
                  .catch(() => {
                        if (!controller.signal.aborted) setSlides([]);
                  })
                  .finally(() => completeHomeLoad("header"));

            return () => controller.abort();
      }, []);

      // Real Parallax tween matching the exact user demo implementation
      useEffect(() => {
            if (!apiInstance) return;

            const onSelect = () => {
                  setSelectedIndex(apiInstance.selectedSnap());
            };
            apiInstance.on("select", onSelect);
            apiInstance.on("reinit", onSelect);
            onSelect();

            let layers = apiInstance
                  .slideNodes()
                  .map((slide) => slide.querySelector("[data-parallax-layer]"));

            const updateLayers = () => {
                  layers = apiInstance
                        .slideNodes()
                        .map((slide) => slide.querySelector("[data-parallax-layer]"));
            };

            const tween = (_api, event) => {
                  if (!layers || layers.length === 0) return;
                  const engine = apiInstance.internalEngine();
                  const scrollProgress = apiInstance.scrollProgress();
                  const slidesInView = apiInstance.slidesInView();
                  const isScroll = event?.type === "scroll";

                  apiInstance.snapList().forEach((snap, snapIndex) => {
                        let diffToTarget = snap - scrollProgress;
                        const slidesInSnap = engine.scrollSnapList.slidesBySnap[snapIndex] ?? [];

                        slidesInSnap.forEach((slideIndex) => {
                              if (isScroll && !slidesInView.includes(slideIndex)) return;
                              if (engine.options.loop) {
                                    engine.slideLooper.loopPoints.forEach((loopItem) => {
                                          const target = loopItem.target();
                                          if (slideIndex === loopItem.index && target !== 0) {
                                                const sign = Math.sign(target);
                                                if (sign === -1) diffToTarget = snap - (1 + scrollProgress);
                                                if (sign === 1) diffToTarget = snap + (1 - scrollProgress);
                                          }
                                    });
                              }
                              const translate = diffToTarget * (-1 * PARALLAX_FACTOR) * 100;
                              const layer = layers[slideIndex];
                              if (layer) {
                                    layer.style.transform = `translateX(${translate}%)`;
                              }
                        });
                  });
            };

            tween(apiInstance);
            apiInstance.on("scroll", tween);
            apiInstance.on("slidefocus", tween);
            apiInstance.on("reinit", () => {
                  updateLayers();
                  onSelect();
                  tween(apiInstance);
            });

            return () => {
                  apiInstance.off("select", onSelect);
                  apiInstance.off("reinit", onSelect);
                  apiInstance.off("scroll", tween);
                  apiInstance.off("slidefocus", tween);
            };
      }, [apiInstance, slides]);

      if (slides.length === 0) {
            return (
                  <header className="relative w-full pt-4 sm:pt-6 pb-6 overflow-hidden select-none bg-[#120403]">
                        <div className="relative w-full flex items-center justify-center gap-3 sm:gap-5 md:gap-6 px-2 sm:px-4">
                              <div className="hidden sm:block shrink-0 w-[14%] sm:w-[16%] md:w-[18%] h-[48vh] sm:h-[56vh] md:h-[64vh] max-h-[660px] rounded-2xl sm:rounded-3xl bg-white/[0.04] opacity-50 overflow-hidden" />

                              <div className="w-[84%] sm:w-[76%] md:w-2/3 h-[52vh] sm:h-[60vh] md:h-[68vh] lg:h-[74vh] min-h-[440px] max-h-[700px] rounded-2xl sm:rounded-3xl bg-white/[0.07] overflow-hidden flex flex-col justify-end p-6 sm:p-10 animate-pulse">
                                    <div className="flex flex-col gap-4 max-w-xl">
                                          <div className="h-6 w-32 rounded-full bg-white/10" />
                                          <div className="h-10 sm:h-14 w-3/4 rounded-xl bg-white/15" />
                                          <div className="flex gap-3">
                                                <div className="h-4 w-16 rounded bg-white/10" />
                                                <div className="h-4 w-14 rounded bg-white/10" />
                                          </div>
                                          <div className="h-8 w-full rounded bg-white/5" />
                                          <div className="flex gap-3 pt-2">
                                                <div className="h-10 w-28 rounded-full bg-white/15" />
                                                <div className="h-10 w-24 rounded-full bg-white/10" />
                                          </div>
                                    </div>
                              </div>

                              <div className="hidden sm:block shrink-0 w-[14%] sm:w-[16%] md:w-[18%] h-[48vh] sm:h-[56vh] md:h-[64vh] max-h-[660px] rounded-2xl sm:rounded-3xl bg-white/[0.04] opacity-50 overflow-hidden" />
                        </div>
                  </header>
            );
      }

      return (
            <header className="relative w-full pt-2 sm:pt-4 pb-4 sm:pb-6 overflow-hidden leading-none font-primary select-none group">
                  <Carousel
                        loop
                        align="center"
                        duration={18}
                        autoplay={{ delay: 4500, resumeAfter: 2500 }}
                        setApi={setApiInstance}
                        light
                        className="relative w-full"
                  >
                        {/* Floating Navigation Arrows */}
                        <CarouselPrev
                              position="none"
                              className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 pointer-events-auto"
                              render={
                                    <button
                                          type="button"
                                          aria-label="Previous slide"
                                          className="size-10 sm:size-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:bg-[#ff7949] active:scale-95 transition-colors cursor-pointer shadow-2xl"
                                    >
                                          <ChevronLeft className="size-5 sm:size-6" />
                                    </button>
                              }
                        />
                        <CarouselNext
                              position="none"
                              className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-auto"
                              render={
                                    <button
                                          type="button"
                                          aria-label="Next slide"
                                          className="size-10 sm:size-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:bg-[#ff7949] active:scale-95 transition-colors cursor-pointer shadow-2xl"
                                    >
                                          <ChevronRight className="size-5 sm:size-6" />
                                    </button>
                              }
                        />

                        {/* Carousel Track with Centered Active Card & Borderless Peeking Neighbor Cards */}
                        <CarouselContent className="-ms-3 sm:-ms-5 md:-ms-6 py-2">
                              {slides.map((slide, index) => {
                                    const isPriority = index === 0;

                                    return (
                                          <CarouselSlide
                                                key={slide.id}
                                                className="ps-3 sm:ps-5 md:ps-6 basis-[84%] sm:basis-[76%] md:basis-2/3 shrink-0 grow-0 min-w-0"
                                          >
                                                {/* Pure borderless parallax card window matching demo */}
                                                <div
                                                      onClick={() => {
                                                            if (index !== selectedIndex) {
                                                                  apiInstance?.scrollTo(index);
                                                            }
                                                      }}
                                                      className="group/card relative w-full h-[52vh] sm:h-[60vh] md:h-[68vh] lg:h-[74vh] min-h-[440px] max-h-[700px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none shadow-2xl bg-[#140403]"
                                                >
                                                      {/* Parallax Backdrop Image */}
                                                      <div
                                                            data-parallax-layer
                                                            className="absolute inset-0 size-full will-change-transform pointer-events-none"
                                                      >
                                                            <img
                                                                  src={slide.src}
                                                                  alt={slide.alt}
                                                                  loading={isPriority ? "eager" : "lazy"}
                                                                  decoding="async"
                                                                  className="size-full scale-[1.65] object-cover pointer-events-none select-none"
                                                            />
                                                      </div>

                                                      {/* Cinematic Scrims for razor-sharp typography */}
                                                      <div
                                                            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/95 via-black/40 to-transparent"
                                                            aria-hidden="true"
                                                      />
                                                      <div
                                                            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/75 via-transparent to-transparent"
                                                            aria-hidden="true"
                                                      />

                                                      {/* Slide Content */}
                                                      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col items-start gap-3 sm:gap-4 max-w-3xl pointer-events-none">
                                                            {/* Pill Badge */}
                                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#ffb196] bg-[#300b07]/80 backdrop-blur-md shadow-sm">
                                                                  <Flame size={14} className="text-[#ff7949] animate-pulse" />
                                                                  <span>{slide.label}</span>
                                                            </div>

                                                            {/* Title */}
                                                            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-xl line-clamp-2 leading-[1.08]">
                                                                  {slide.title}
                                                            </h1>

                                                            {/* Meta Info */}
                                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-white/80 font-medium">
                                                                  {Number(slide.rating) > 0 && (
                                                                        <span className="inline-flex items-center gap-1.5 font-bold text-[#ffd478]">
                                                                              <Star size={14} fill="currentColor" aria-hidden="true" />
                                                                              <span>{Number(slide.rating).toFixed(1)} / 10</span>
                                                                        </span>
                                                                  )}
                                                                  {slide.year && (
                                                                        <>
                                                                              <span className="text-white/40">·</span>
                                                                              <span>{slide.year}</span>
                                                                        </>
                                                                  )}
                                                                  {slide.mediaLabel && (
                                                                        <>
                                                                              <span className="text-white/40">·</span>
                                                                              <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/90">
                                                                                    {slide.mediaLabel}
                                                                              </span>
                                                                        </>
                                                                  )}
                                                            </div>

                                                            {/* Overview Synopsis */}
                                                            {slide.overview && (
                                                                  <p className="text-xs sm:text-sm text-white/75 line-clamp-2 sm:line-clamp-3 max-w-2xl leading-relaxed drop-shadow">
                                                                        {slide.overview}
                                                                  </p>
                                                            )}

                                                            {/* Action Buttons */}
                                                            <div className="flex flex-wrap items-center gap-3 pt-1 pointer-events-auto">
                                                                  {slide.watchTo && (
                                                                        <MediaActionButton
                                                                              as={Link}
                                                                              to={slide.watchTo}
                                                                              onClick={() => play("press")}
                                                                              label="Watch Now"
                                                                              icon={Play}
                                                                              activeIcon={CirclePlay}
                                                                              primary
                                                                              className="hero-media-action"
                                                                        />
                                                                  )}
                                                                  {slide.trailerTo && (
                                                                        <MediaActionButton
                                                                              as={Link}
                                                                              to={slide.trailerTo}
                                                                              onClick={() => play("press")}
                                                                              label="Trailer"
                                                                              icon={Clapperboard}
                                                                              activeIcon={SquarePlay}
                                                                              className="hero-media-action"
                                                                        />
                                                                  )}
                                                            </div>
                                                      </div>
                                                </div>
                                          </CarouselSlide>
                                    );
                              })}
                        </CarouselContent>

                        {/* Bottom Controls Bar: Slide Counter & Pagination Dots */}
                        <div className="mt-3 sm:mt-5 flex items-center justify-between px-4 sm:px-10 md:px-16 max-w-7xl mx-auto pointer-events-auto">
                              {/* Slide Counter */}
                              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-white/70 tabular-nums">
                                    <span className="text-white font-bold text-sm sm:text-base">
                                          {String(selectedIndex + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-white/30">/</span>
                                    <span>{String(slides.length).padStart(2, "0")}</span>
                              </div>

                              {/* Pagination Bullets */}
                              <div className="flex items-center">
                                    <CarouselPagination light />
                              </div>

                              {/* Active Movie Quick Teaser */}
                              <div className="text-xs text-white/50 hidden md:flex items-center gap-2 truncate max-w-xs">
                                    <span className="size-2 rounded-full bg-[#ff7949] shrink-0 animate-pulse" />
                                    <span className="truncate">{slides[selectedIndex]?.title}</span>
                              </div>
                        </div>
                  </Carousel>
            </header>
      );
};

export default Header;
