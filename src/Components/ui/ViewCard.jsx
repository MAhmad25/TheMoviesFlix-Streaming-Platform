import { Link } from "react-router-dom";
import ImageLoader from "./Loaders/ImageLoader";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
const ViewCard = ({ eachMovie, type = "movie" }) => {
      const [showSkeleton, setSkeleton] = useState(true);
      return (
            <Link className="w-1/2 shrink-0 h-[80%]" to={`/${eachMovie.media_type || type}/details/${eachMovie.id}`}>
                  <div className="w-full h-full">
                        <div className="w-full overflow-hidden rounded-lg  h-3/4">
                              <AnimatePresence>{showSkeleton && <ImageLoader />} </AnimatePresence>
                              <motion.img loading="lazy" decoding="async" whileHover={{ scale: 1.1, transition: { ease: "circInOut" } }} onLoad={() => setSkeleton(false)} className={`w-full ${showSkeleton ? "invisible" : "visible"} h-full object-cover`} src={eachMovie.backdrop_path || eachMovie.poster_path ? `https://image.tmdb.org/t/p/original${eachMovie?.backdrop_path || eachMovie?.poster_path}` : `/noImage.jpg`} alt={eachMovie?.backdrop_path || eachMovie?.poster_path} />
                        </div>
                        <div className="mt-2 space-y-1">
                              <h1 className="text-sm text-format">{eachMovie.title || eachMovie.original_title || eachMovie.name} </h1>
                              <p className="text-xs text-white/50">{eachMovie.release_date && eachMovie.release_date.split("-")[0]}</p>
                              <p className="text-xs">⭐{eachMovie.vote_average && eachMovie.vote_average.toFixed(1)}</p>
                        </div>
                  </div>
            </Link>
      );
};

export default ViewCard;
