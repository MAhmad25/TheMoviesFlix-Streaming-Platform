import { Link } from "react-router-dom";
import { ImageLoader } from "./index";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const Card = ({ eachMovie, type = "all" }) => {
      const [showSkeleton, setSkeleton] = useState(true);
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
      return (
            <Link to={`/${eachMovie.media_type || type}/details/${eachMovie.id}`}>
                  <motion.section className="w-44 relative sm:w-full sm:min-w-56 shrink-0 overflow-hidden rounded-xl sm:h-56  md:h-72 h-40">
                        <AnimatePresence>{showSkeleton && <ImageLoader />}</AnimatePresence>
                        <motion.img onLoad={() => setSkeleton(false)} className={`w-full ${showSkeleton ? "invisible" : "visible"} h-full object-cover`} src={eachMovie.backdrop_path || eachMovie.poster_path || eachMovie.profile_path ? `https://image.tmdb.org/t/p/original${eachMovie.backdrop_path || eachMovie.poster_path || eachMovie.profile_path}` : `/noImage.jpg`} alt="" />
                  </motion.section>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-2  px-2 py-2 rounded-lg overflow-hidden flex flex-col gap-1 h-fit  w-full md:w-full md:bg-transparent  text-white">
                        {eachMovie.vote_average != 0 && (
                              <motion.h3 variants={childVariants} className="text-white rounded-full whitespace-nowrap  text-xs leading-none  tracking-tighter ">
                                    {eachMovie.vote_average && "⭐"}
                                    {eachMovie.vote_average && eachMovie.vote_average.toFixed(1)}
                              </motion.h3>
                        )}
                        <motion.h3 variants={childVariants} className="text-white w-full text-wrap leading-none text-sm sm:text-lg tracking-tight ">
                              {eachMovie.name || eachMovie.title || eachMovie.original_title}
                        </motion.h3>
                        <motion.p variants={childVariants} className="w-full  leading-3 text-xs sm:text-sm text-zinc-300">
                              {eachMovie.overview && eachMovie.overview.slice(0, 60)}
                        </motion.p>
                  </motion.div>
            </Link>
      );
};
export default Card;
