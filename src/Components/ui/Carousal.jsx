import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselContext } from "./CarouselContext";

export const Carousel = ({ children, options, plugins, className = "" }) => {
      const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);
      const [selectedIndex, setSelectedIndex] = useState(0);

      useEffect(() => {
            if (!emblaApi) return undefined;

            const updateSelectedIndex = () => setSelectedIndex(emblaApi.selectedScrollSnap());
            updateSelectedIndex();
            emblaApi.on("select", updateSelectedIndex);
            emblaApi.on("reInit", updateSelectedIndex);
            return () => {
                  emblaApi.off("select", updateSelectedIndex);
                  emblaApi.off("reInit", updateSelectedIndex);
            };
      }, [emblaApi]);

      const contextValue = useMemo(() => ({ emblaApi, selectedIndex }), [emblaApi, selectedIndex]);

      return (
            <CarouselContext.Provider value={contextValue}>
                  <div className={className}>
                        <div className="overflow-hidden" ref={emblaRef}>
                              {children}
                        </div>
                  </div>
            </CarouselContext.Provider>
      );
};

export const SliderContainer = ({ children, className = "" }) => {
      return <div className={`flex ${className}`}>{children}</div>;
};

export const Slider = ({ children, className = "" }) => {
      return <div className={`flex-[0_0_100%] min-w-0 ${className}`}>{children}</div>;
};

export const SliderDotButton = ({ className = "" }) => {
      const { emblaApi } = useContext(CarouselContext);
      const [selectedIndex, setSelectedIndex] = useState(0);
      const [scrollSnaps, setScrollSnaps] = useState([]);

      const onDotButtonClick = useCallback(
            (index) => {
                  if (!emblaApi) return;
                  emblaApi.scrollTo(index);
            },
            [emblaApi]
      );

      const onInit = useCallback((emblaApi) => {
            setScrollSnaps(emblaApi.scrollSnapList());
      }, []);

      const onSelect = useCallback((emblaApi) => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
      }, []);

      useEffect(() => {
            if (!emblaApi) return;

            onInit(emblaApi);
            onSelect(emblaApi);
            emblaApi.on("reInit", onInit);
            emblaApi.on("reInit", onSelect);
            emblaApi.on("select", onSelect);

            return () => {
                  emblaApi.off("reInit", onInit);
                  emblaApi.off("reInit", onSelect);
                  emblaApi.off("select", onSelect);
            };
      }, [emblaApi, onInit, onSelect]);

      return (
            <div className={`flex gap-2 ${className}`}>
                  {scrollSnaps.map((_, index) => (
                        <button key={index} onClick={() => onDotButtonClick(index)} className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"}`} aria-label={`Go to slide ${index + 1}`} />
                  ))}
            </div>
      );
};
