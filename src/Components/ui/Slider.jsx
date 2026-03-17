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
                  <motion.div ref={carousel} drag="x" dragElastic={0.2} dragConstraints={{ right: 0, left: -width }} dragTransition={{ bounceDamping: 30 }} transition={{ duration: 0.1, ease: "easeInOut" }} className="flex  cursor-pointer active:cursor-grabbing gap-5">
                        {trendingMovie?.map((eachMovie, index) => (
                              <motion.div key={eachMovie.id || index} className="shrink-0 w-44 md:w-56">
                                    <Card type={type} eachMovie={eachMovie} />
                              </motion.div>
                        ))}
                  </motion.div>
            </div>
      );
}

export default Slider;
