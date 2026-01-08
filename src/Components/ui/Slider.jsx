import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Card from "./Card";

function Slider({ trendingMovie, type = "movie" }) {
      const [width, setWidth] = useState(0);
      const carousel = useRef(null);

      useEffect(() => {
            if (carousel.current) {
                  setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
            }
      }, [trendingMovie]);

      return (
            <div className="w-full relative">
                  <motion.div ref={carousel} drag="x" whileDrag={{ scale: 0.98 }} dragElastic={0.2} dragConstraints={{ right: 0, left: -width }} dragTransition={{ bounceDamping: 30 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="flex will-change-transform cursor-grab active:cursor-grabbing gap-5 sm:gap-20">
                        {trendingMovie?.map((eachMovie, index) => (
                              <motion.div key={eachMovie.id || index} className="shrink-0 w-44">
                                    <Card type={type} eachMovie={eachMovie} />
                              </motion.div>
                        ))}
                  </motion.div>
            </div>
      );
}

export default Slider;
