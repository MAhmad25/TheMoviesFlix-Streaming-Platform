"use client";

import * as React from "react";
import { motion, type Transition } from "motion/react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PerspectiveCarouselItem {
  src: string;
  title: string;
  alt?: string;
  subtitle?: string;
  season?: any;
  onOpen?: (season: any) => void;
}

export interface PerspectiveCarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: PerspectiveCarouselItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  onItemClick?: (item: PerspectiveCarouselItem, index: number) => void;
  loop?: boolean;
  slideWidth?: number;
  rotationStep?: number;
  inactiveScale?: number;
  transition?: Transition;
  showControls?: boolean;
  showDots?: boolean;
  viewportClassName?: string;
  slideClassName?: string;
  imageClassName?: string;
  controlsClassName?: string;
}

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  bounce: 0.12,
  duration: 0.65,
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function PerspectiveCarousel({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  onItemClick,
  loop = false,
  slideWidth = 250,
  rotationStep = 45,
  inactiveScale = 0.84,
  transition = DEFAULT_TRANSITION,
  showControls = true,
  showDots = true,
  viewportClassName,
  slideClassName,
  imageClassName,
  controlsClassName,
  className,
  onKeyDown,
  tabIndex,
  ...props
}: PerspectiveCarouselProps) {
  const maxIndex = Math.max(0, items.length - 1);
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(() =>
    clamp(defaultActiveIndex, 0, maxIndex)
  );
  const currentIndex = clamp(activeIndex ?? uncontrolledIndex, 0, maxIndex);

  // Responsive slide width: comfortable width on mobile and desktop
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const safeSlideWidth = isMobile ? Math.min(slideWidth, 225) : slideWidth;
  const safeInactiveScale = clamp(inactiveScale, 0.5, 1);

  const selectSlide = React.useCallback(
    (nextIndex: number) => {
      if (!items.length) return;

      const resolvedIndex = loop
        ? (nextIndex + items.length) % items.length
        : clamp(nextIndex, 0, maxIndex);

      if (activeIndex === undefined) {
        setUncontrolledIndex(resolvedIndex);
      }

      onActiveIndexChange?.(resolvedIndex);
    },
    [activeIndex, items.length, loop, maxIndex, onActiveIndexChange]
  );

  if (!items.length) return null;

  const isPreviousDisabled = !loop && currentIndex === 0;
  const isNextDisabled = !loop && currentIndex === maxIndex;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectSlide(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectSlide(currentIndex + 1);
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Perspective carousel"
      tabIndex={tabIndex ?? 0}
      onKeyDown={handleKeyDown}
      className={cn("relative isolate h-full w-full overflow-hidden select-none", className)}
      {...props}
    >
      <div
        className={cn("absolute inset-0 overflow-hidden", viewportClassName)}
        style={{ perspective: "1200px" }}
      >
        <motion.div
          className="absolute left-1/2 top-2 sm:top-3 flex w-fit items-start"
          animate={{ x: -(currentIndex * safeSlideWidth + safeSlideWidth / 2) }}
          transition={transition}
        >
          {items.map((item, index) => {
            const isActive = currentIndex === index;

            return (
              <div
                key={`${item.title}-${index}`}
                className="shrink-0"
                style={{ width: safeSlideWidth, perspective: "1200px" }}
              >
                <motion.div
                  className={cn(
                    "flex w-full flex-col items-center will-change-transform",
                    slideClassName
                  )}
                  animate={{
                    rotateY: (currentIndex - index) * rotationStep,
                    scale: isActive ? 1 : safeInactiveScale,
                  }}
                  transition={transition}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <button
                    type="button"
                    aria-label={`Open ${item.title}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "aspect-[2/3] w-full cursor-pointer relative group rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 text-left",
                      isActive
                        ? "ring-2 ring-[#ff7949]/50 shadow-[0_16px_40px_rgba(0,0,0,0.8)]"
                        : "opacity-60 hover:opacity-85 shadow-lg"
                    )}
                    onClick={() => {
                      if (isActive) {
                        onItemClick?.(item, index);
                        item.onOpen?.(item.season);
                      } else {
                        selectSlide(index);
                      }
                    }}
                  >
                    <img
                      src={item.src}
                      alt={item.alt ?? item.title}
                      draggable={false}
                      className={cn(
                        "h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105",
                        imageClassName
                      )}
                    />

                    {/* Top Season Badges */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#140605]/85 backdrop-blur-md text-white border border-white/15 shadow-sm">
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ff7949]/25 text-[#ffb196] border border-[#ff7949]/35 backdrop-blur-md shadow-sm">
                          {item.subtitle.split("·")[0]?.trim()}
                        </span>
                      )}
                    </div>

                    {/* Card Body Overlay with Prominent CTA Button */}
                    <div
                      className={cn(
                        "absolute inset-0 flex flex-col justify-end p-3.5 sm:p-4 transition-all duration-300",
                        isActive
                          ? "bg-gradient-to-t from-black/95 via-black/55 to-transparent"
                          : "bg-gradient-to-t from-black/85 via-black/30 to-transparent"
                      )}
                    >
                      <div className="flex flex-col">
                        <p className="font-bold text-white text-base sm:text-lg tracking-tight leading-tight drop-shadow">
                          {item.title}
                        </p>
                        {item.subtitle && (
                          <span className="text-xs text-white/70 mt-0.5 drop-shadow">
                            {item.subtitle}
                          </span>
                        )}
                      </div>

                      {/* Explicit Call-To-Action Button for user clarity */}
                      {isActive ? (
                        <div className="mt-3 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-full bg-[#ff7949] hover:bg-[#ff956e] text-[#1c0705] font-bold text-xs sm:text-sm shadow-md transition-transform group-hover:scale-[1.02] active:scale-95">
                          <Play className="size-3.5 fill-current" />
                          <span>View Episodes</span>
                        </div>
                      ) : (
                        <span className="mt-2 text-[11px] text-white/50 group-hover:text-white transition-colors text-center">
                          Tap to select
                        </span>
                      )}
                    </div>
                  </button>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Control capsule cleanly positioned below the cards */}
      {showControls && (
        <div
          className={cn(
            "absolute inset-x-4 bottom-2 z-20 mx-auto flex w-fit items-center justify-center gap-3 rounded-full border border-white/15 bg-[#140605]/85 px-3 py-1.5 text-white shadow-xl backdrop-blur-md",
            controlsClassName
          )}
        >
          <button
            type="button"
            aria-label="Show previous slide"
            disabled={isPreviousDisabled}
            className="inline-flex size-7 items-center justify-center rounded-full transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
            onClick={() => selectSlide(currentIndex - 1)}
          >
            <ChevronLeft className="size-4" />
          </button>

          {showDots && (
            <div className="flex items-center justify-center gap-1.5">
              {items.map((item, index) => (
                <button
                  key={`${item.title}-${index}`}
                  type="button"
                  aria-label={`Show slide ${index + 1}: ${item.title}`}
                  aria-current={currentIndex === index ? "true" : undefined}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    currentIndex === index ? "w-6 bg-[#ff7949]" : "w-1.5 bg-white/40 hover:bg-white/70"
                  )}
                  onClick={() => selectSlide(index)}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            aria-label="Show next slide"
            disabled={isNextDisabled}
            className="inline-flex size-7 items-center justify-center rounded-full transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
            onClick={() => selectSlide(currentIndex + 1)}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default PerspectiveCarousel;
