import { Children, createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

const CarouselContext = createContext(null);
const springTransition = { type: "spring", stiffness: 280, damping: 32, mass: 0.9 };

function useCarousel() {
      const context = useContext(CarouselContext);
      if (!context) {
            throw new Error("useCarousel must be used within a Carousel");
      }
      return context;
}

function Carousel({ children, className }) {
      const [index, setIndex] = useState(0);
      const [itemsCount, setItemsCount] = useState(0);
      const [itemsPerView, setItemsPerView] = useState(1);

      return (
            <CarouselContext.Provider value={{ index, setIndex, itemsCount, setItemsCount, itemsPerView, setItemsPerView }}>
                  <div className={cn("relative", className)}>{children}</div>
            </CarouselContext.Provider>
      );
}

function CarouselContent({ children, className }) {
      const { index, setIndex, setItemsCount, itemsPerView, setItemsPerView } = useCarousel();
      const viewportRef = useRef(null);
      const trackRef = useRef(null);
      const animationRef = useRef(null);
      const x = useMotionValue(0);
      const reduceMotion = useReducedMotion();
      const [itemWidth, setItemWidth] = useState(0);
      const itemsCount = Children.count(children);

      useEffect(() => {
            setItemsCount(itemsCount);
      }, [itemsCount, setItemsCount]);

      useEffect(() => {
            const viewport = viewportRef.current;
            const track = trackRef.current;
            if (!viewport || !track) return;

            const measure = () => {
                  const firstItem = track.firstElementChild;
                  const width = firstItem?.getBoundingClientRect().width ?? 0;
                  if (!width) return;
                  setItemWidth(width);
                  setItemsPerView(Math.max(1, viewport.getBoundingClientRect().width / width));
            };

            measure();
            const observer = new ResizeObserver(measure);
            observer.observe(viewport);
            if (track.firstElementChild) observer.observe(track.firstElementChild);
            return () => observer.disconnect();
      }, [children, setItemsPerView]);

      const maxIndex = Math.max(0, Math.ceil(itemsCount - itemsPerView - 0.0001));
      const safeIndex = Math.min(index, maxIndex);
      const dragLeft = -Math.min(maxIndex, safeIndex + 1) * itemWidth;
      const dragRight = -Math.max(0, safeIndex - 1) * itemWidth;

      useEffect(() => {
            if (index > maxIndex) setIndex(maxIndex);
      }, [index, maxIndex, setIndex]);

      useEffect(() => {
            animationRef.current?.stop();
            animationRef.current = animate(x, -safeIndex * itemWidth, reduceMotion ? { duration: 0 } : springTransition);
      }, [safeIndex, itemWidth, reduceMotion, x]);

      useEffect(() => () => animationRef.current?.stop(), []);

      const handleDragEnd = useCallback(
            (_, info) => {
                  if (!itemWidth) return;

                  let nextIndex = safeIndex;
                  if (info.offset.x < -itemWidth * 0.2 || info.velocity.x < -450) nextIndex += 1;
                  else if (info.offset.x > itemWidth * 0.2 || info.velocity.x > 450) nextIndex -= 1;

                  nextIndex = Math.max(0, Math.min(maxIndex, nextIndex));
                  if (nextIndex !== safeIndex) setIndex(nextIndex);

                  animationRef.current?.stop();
                  animationRef.current = animate(x, -nextIndex * itemWidth, reduceMotion ? { duration: 0 } : springTransition);
            },
            [itemWidth, maxIndex, reduceMotion, safeIndex, setIndex, x]
      );

      return (
            <div ref={viewportRef} className="overflow-hidden">
                  <motion.div
                        ref={trackRef}
                        drag="x"
                        dragConstraints={{ left: dragLeft, right: dragRight }}
                        dragElastic={0.12}
                        dragMomentum={false}
                        onDragEnd={handleDragEnd}
                        style={{ x }}
                        className={cn("flex cursor-grab items-stretch active:cursor-grabbing", className)}
                  >
                        {children}
                  </motion.div>
            </div>
      );
}

function CarouselNavigation({ className }) {
      const { index, setIndex, itemsCount, itemsPerView } = useCarousel();
      const maxIndex = Math.max(0, Math.ceil(itemsCount - itemsPerView - 0.0001));
      const safeIndex = Math.min(index, maxIndex);

      if (maxIndex === 0) return null;

      const buttonClass =
            "pointer-events-auto grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-[#300b07]/85 text-white shadow-lg backdrop-blur transition hover:bg-[#4a120c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-30";

      return (
            <div className={cn("pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-between px-1 sm:px-2", className)}>
                  <button type="button" aria-label="Previous slide" disabled={safeIndex <= 0} onClick={() => setIndex(Math.max(0, safeIndex - 1))} className={buttonClass}>
                        <ChevronLeft size={18} />
                  </button>
                  <button type="button" aria-label="Next slide" disabled={safeIndex >= maxIndex} onClick={() => setIndex(Math.min(maxIndex, safeIndex + 1))} className={buttonClass}>
                        <ChevronRight size={18} />
                  </button>
            </div>
      );
}

function CarouselIndicator({ className }) {
      const { index, setIndex, itemsCount, itemsPerView } = useCarousel();
      const maxIndex = Math.max(0, Math.ceil(itemsCount - itemsPerView - 0.0001));
      const safeIndex = Math.min(index, maxIndex);

      if (maxIndex === 0) return null;

      return (
            <div className={cn("relative z-10 mt-4 flex flex-wrap items-center justify-center gap-1.5", className)}>
                  {Array.from({ length: maxIndex + 1 }, (_, i) => (
                        <button
                              key={i}
                              type="button"
                              aria-label={`Go to slide ${i + 1}`}
                              onClick={() => setIndex(i)}
                              className={cn("h-1.5 rounded-full transition-all", i === safeIndex ? "w-6 bg-white" : "w-1.5 bg-white/35 hover:bg-white/60")}
                        />
                  ))}
            </div>
      );
}

function CarouselItem({ children, className }) {
      return <div className={cn("w-full min-w-0 shrink-0 grow-0", className)}>{children}</div>;
}

export { Carousel, CarouselContent, CarouselNavigation, CarouselIndicator, CarouselItem };
