import { memo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ImageLoader } from "./index";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const Card = ({ eachMovie, type = "all" }) => {
      const [showSkeleton, setSkeleton] = useState(true);
      const navigate = useNavigate();
      const isDragging = useRef(false);

      const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                  opacity: 1,
                  transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2,
                  },
            },
      };

      const childVariants = {
            hidden: {
                  opacity: 0,
                  y: 20,
            },
            visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                        duration: 0.5,
                        ease: "easeOut",
                  },
            },
      };

      const handleClick = () => {
            if (!isDragging.current) {
                  navigate(`/${eachMovie.media_type || type}/details/${eachMovie.id}`);
            }
      };

      return (
            <div onClick={handleClick} onMouseDown={() => (isDragging.current = false)} onMouseMove={() => (isDragging.current = true)} onMouseUp={() => setTimeout(() => (isDragging.current = false), 100)} className="cursor-grab">
                  <motion.section className="w-44 relative sm:w-full sm:min-w-56 shrink-0 overflow-hidden rounded-xl sm:h-56 md:h-72 h-40">
                        <AnimatePresence>{showSkeleton && <ImageLoader />}</AnimatePresence>
                        <motion.img loading="lazy" decoding="async" whileHover={{ scale: 1.1, transition: { ease: "circInOut" } }} onLoad={() => setSkeleton(false)} className={`w-full ${showSkeleton ? "invisible" : "visible"} h-full object-cover pointer-events-none`} src={eachMovie.backdrop_path || eachMovie.poster_path || eachMovie.profile_path ? `https://image.tmdb.org/t/p/original${eachMovie.backdrop_path || eachMovie.poster_path || eachMovie.profile_path}` : `/noImage.jpg`} alt={eachMovie.name || eachMovie.title || eachMovie.original_title} />
                  </motion.section>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-2 px-2 py-2 rounded-lg overflow-hidden flex flex-col gap-1 h-fit w-full md:w-full md:bg-transparent text-white">
                        {eachMovie.vote_average != 0 && (
                              <div className="w-full gap-10 flex items-center justify-between">
                                    <motion.span variants={childVariants} className="text-white rounded-full whitespace-nowrap text-xs leading-none tracking-tighter">
                                          {eachMovie.vote_average && "⭐"}
                                          {eachMovie.vote_average && eachMovie.vote_average.toFixed(1)}
                                    </motion.span>
                                    {eachMovie?.release_date && (
                                          <motion.span variants={childVariants} className="px-3 tracking-tighter leading-none py-1 bg-white/10 text-xs text-zinc-300 md:text-white rounded-full overflow-hidden flex w-fit justify-center items-center backdrop-blur-2xl">
                                                {eachMovie?.release_date?.split("-")[0]}
                                          </motion.span>
                                    )}
                              </div>
                        )}
                        <motion.h3 variants={childVariants} className="text-white w-full text-wrap leading-none text-sm sm:text-[1.05rem] tracking-tight">
                              {eachMovie.name || eachMovie.title || eachMovie.original_title}
                        </motion.h3>
                        <motion.p variants={childVariants} className="w-full leading-3 text-xs sm:text-sm text-zinc-300">
                              {eachMovie.overview && eachMovie.overview.slice(0, 30)}
                        </motion.p>
                  </motion.div>
            </div>
      );
};
export default memo(Card);
