import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { play } from "cuelume";
import { cn } from "../../lib/utils";

const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

function clampIndex(index, count) {
      return Math.max(0, Math.min(count - 1, index));
}

export function CoverflowCarousel({
      slides,
      rotate = 44,
      depth = 0.6,
      perspective = 3,
      falloff = 0.56,
      fade = 0.1,
      cardWidth = "clamp(148px, 22vw, 240px)",
      gap = 0.05,
      loop = true,
      showCaption = false,
      showPagination = false,
      showNavigation = false,
      initialIndex = 0,
      label = "Cover carousel",
      className,
      cardClassName,
      onSlideSelect,
}) {
      const count = slides.length;
      const reducedMotion = useReducedMotion();
      const safeInitial = count ? clampIndex(initialIndex, count) : 0;
      const initialIndexRef = React.useRef(safeInitial);
      const frameRef = React.useRef(null);
      const cardRefs = React.useRef([]);
      const posRef = React.useRef(safeInitial);
      const targetRef = React.useRef(safeInitial);
      const widthRef = React.useRef(0);
      const rafRef = React.useRef(null);
      const dragRef = React.useRef(null);
      const wasDragRef = React.useRef(false);
      const [selected, setSelected] = React.useState(safeInitial);

      const indexAt = React.useCallback((pos) => (count ? ((Math.round(pos) % count) + count) % count : 0), [count]);

      const paint = React.useCallback(() => {
            const width = widthRef.current;
            if (!width || !count) return;
            const pitch = width * (1 + gap);
            const pos = posRef.current;

            cardRefs.current.forEach((card, index) => {
                  if (!card) return;
                  let offset = index - pos;
                  if (loop) {
                        offset = ((offset % count) + count) % count;
                        if (offset > count / 2) offset -= count;
                  }
                  const distance = Math.abs(offset);
                  const ramp = Math.pow(distance, falloff);
                  const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);
                  card.style.transform =
                        `translateX(calc(-50% + ${offset * pitch}px)) ` +
                        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;
                  const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
                  card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
                  card.style.zIndex = String(100 - Math.round(distance));
            });
      }, [count, depth, fade, falloff, gap, loop, rotate]);

      const settle = React.useCallback((target) => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            targetRef.current = target;
            setSelected(indexAt(target));
            if (reducedMotion) {
                  posRef.current = target;
                  paint();
                  rafRef.current = null;
                  return;
            }
            const step = () => {
                  const remaining = target - posRef.current;
                  if (Math.abs(remaining) < 0.0004) {
                        posRef.current = target;
                        paint();
                        rafRef.current = null;
                        return;
                  }
                  posRef.current += remaining * 0.16;
                  paint();
                  rafRef.current = requestAnimationFrame(step);
            };
            rafRef.current = requestAnimationFrame(step);
      }, [indexAt, paint, reducedMotion]);

      const clamp = React.useCallback((pos) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))), [count, loop]);
      const goTo = React.useCallback((index) => {
            const target = loop ? index + Math.round((targetRef.current - index) / count) * count : index;
            settle(clamp(target));
      }, [clamp, count, loop, settle]);
      const nudge = React.useCallback((by) => settle(clamp(Math.round(targetRef.current) + by)), [clamp, settle]);

      React.useEffect(() => {
            const next = initialIndexRef.current !== safeInitial
                  ? safeInitial
                  : count ? clampIndex(selected, count) : 0;
            initialIndexRef.current = safeInitial;
            if (selected !== next) {
                  setSelected(next);
                  posRef.current = next;
                  targetRef.current = next;
                  paint();
            }
      }, [count, paint, safeInitial, selected]);

      const onPointerDown = (event) => {
            if (event.button !== 0) return;
            wasDragRef.current = false;
            dragRef.current = {
                  id: event.pointerId,
                  x: event.clientX,
                  pos: posRef.current,
                  v: 0,
                  t: performance.now(),
                  moved: false,
            };
            if (rafRef.current !== null) {
                  cancelAnimationFrame(rafRef.current);
                  rafRef.current = null;
            }
            targetRef.current = posRef.current;
      };

      const onPointerMove = (event) => {
            const drag = dragRef.current;
            if (!drag || drag.id !== event.pointerId || !widthRef.current) return;
            if (!drag.moved && Math.abs(event.clientX - drag.x) > 6) {
                  drag.moved = true;
                  event.currentTarget.setPointerCapture(event.pointerId);
            }
            if (!drag.moved) return;

            const pitch = widthRef.current * (1 + gap);
            const now = performance.now();
            const previous = posRef.current;
            posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
            drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
            drag.t = now;
            const nextSelected = indexAt(posRef.current);
            setSelected((current) => current === nextSelected ? current : nextSelected);
            paint();
      };

      const endDrag = (event) => {
            const drag = dragRef.current;
            if (!drag || drag.id !== event.pointerId) return;
            dragRef.current = null;
            if (drag.moved) {
                  wasDragRef.current = true;
                  const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
                  settle(clamp(Math.round(posRef.current + carried)));
                  window.setTimeout(() => { wasDragRef.current = false; }, 0);
            }
      };

      useIsoLayoutEffect(() => {
            const frame = frameRef.current;
            if (!frame) return undefined;
            const measure = () => {
                  const card = cardRefs.current[0];
                  if (!card) return;
                  widthRef.current = card.offsetWidth;
                  paint();
            };
            measure();
            const observer = new ResizeObserver(measure);
            observer.observe(frame);
            return () => observer.disconnect();
      }, [paint, count]);

      React.useEffect(() => () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      }, []);

      const active = slides[selected];
      if (!count) return null;

      return (
            <div className={cn("w-full", className)} style={{ ["--cf-card"]: cardWidth }} role="region" aria-roledescription="carousel" aria-label={label}>
                  <div className="relative">
                        <div
                              ref={frameRef}
                              tabIndex={0}
                              onPointerDown={onPointerDown}
                              onPointerMove={onPointerMove}
                              onPointerUp={endDrag}
                              onPointerCancel={endDrag}
                              onKeyDown={(event) => {
                                    if (event.key === "ArrowLeft") {
                                          event.preventDefault();
                                          nudge(-1);
                                    } else if (event.key === "ArrowRight") {
                                          event.preventDefault();
                                          nudge(1);
                                    }
                              }}
                              className="cursor-grab overflow-hidden py-3 outline-none focus-visible:ring-2 focus-visible:ring-[#ff7949] active:cursor-grabbing"
                              style={{ perspective: `calc(var(--cf-card) * ${perspective})`, touchAction: "pan-y" }}
                        >
                              <div className="relative mx-auto" style={{ height: "calc(var(--cf-card) * 1.5)", transformStyle: "preserve-3d" }}>
                                    {slides.map((slide, index) => (
                                          <button
                                                key={slide.id ?? index}
                                                ref={(node) => { cardRefs.current[index] = node; }}
                                                type="button"
                                                onClick={() => {
                                                      if (wasDragRef.current) return;
                                                      if (index === selected) onSlideSelect?.(slide, index);
                                                      else goTo(index);
                                                }}
                                                aria-label={`${slide.title || slide.alt}, slide ${index + 1} of ${count}${index === selected ? ". Select season" : ". Focus slide"}`}
                                                aria-current={index === selected ? "true" : undefined}
                                                className={cn("absolute left-1/2 top-0 aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-[#180604] p-0 text-left shadow-xl will-change-transform", cardClassName)}
                                                style={{ width: "var(--cf-card)" }}
                                          >
                                                <img src={slide.src} alt={slide.alt} draggable={false} className="h-full w-full select-none object-cover" />
                                          </button>
                                    ))}
                              </div>
                        </div>

                        {showNavigation && (
                              <>
                                    <button type="button" aria-label="Previous slide" onClick={() => nudge(-1)} className="absolute left-3 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-[#300b07]/85 p-2 text-white backdrop-blur transition hover:bg-[#300b07]">
                                          <ChevronLeft className="size-5" />
                                    </button>
                                    <button type="button" aria-label="Next slide" onClick={() => nudge(1)} className="absolute right-3 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-[#300b07]/85 p-2 text-white backdrop-blur transition hover:bg-[#300b07]">
                                          <ChevronRight className="size-5" />
                                    </button>
                              </>
                        )}
                  </div>

                  {showCaption && active?.title && (
                        <div key={selected} className="coverflow-season-label mt-1 flex flex-col items-center px-6">
                              <p className="text-[15px] font-semibold tracking-tight text-white">{active.title}</p>
                              {active.subtitle && <p className="mt-1 text-[13px] text-white/70">{active.subtitle}</p>}
                              {onSlideSelect && <p className="mt-1 text-[11px] text-white/50">Select the poster to browse episodes.</p>}
                              {active.meta?.length > 0 && (
                                    <dl className="mt-3 w-full max-w-[230px] text-[12px]">
                                          {active.meta.map((row) => <div key={row.label} className="flex justify-between py-1"><dt className="text-white/60">{row.label}</dt><dd className="font-medium text-white">{row.value}</dd></div>)}
                                    </dl>
                              )}
                        </div>
                  )}

                  {showPagination && (
                        <div className="mt-3 flex items-center justify-center gap-2">
                              {slides.map((slide, index) => (
                                    <button key={slide.id ?? index} type="button" aria-label={`Go to slide ${index + 1}`} aria-current={index === selected} onClick={() => goTo(index)} className={cn("size-2 rounded-full bg-white transition-opacity", index === selected ? "opacity-100" : "opacity-35")} />
                              ))}
                        </div>
                  )}
            </div>
      );
}

export function CoverFlow({ items = [], setSeason, initialIndex = 0, className, showNavigation = false }) {
      const slides = React.useMemo(() => items.map((season) => ({
            id: season.id ?? season.season_number,
            src: season.poster_path ? `https://image.tmdb.org/t/p/w500${season.poster_path}` : "/noImage.jpg",
            alt: `${season.name || "TV season"} poster`,
            title: season.name || `Season ${season.season_number}`,
            subtitle: `${season.episode_count || 0} ${Number(season.episode_count) === 1 ? "episode" : "episodes"}`,
            season,
      })), [items]);

      return (
            <CoverflowCarousel
                  slides={slides}
                  initialIndex={initialIndex}
                  cardWidth="clamp(148px, 22vw, 240px)"
                  showCaption
                  showNavigation={showNavigation}
                  label="TV seasons"
                  className={className}
                  onSlideSelect={(slide) => {
                        play("press");
                        setSeason?.(slide.season);
                  }}
            />
      );
}
