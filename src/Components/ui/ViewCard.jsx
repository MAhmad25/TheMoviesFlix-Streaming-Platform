import { Link } from "react-router-dom";
import { play } from "cuelume";
import ImageLoader from "./Loaders/ImageLoader";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const ViewCard = ({ eachMovie, type = "movie" }) => {
      const [showSkeleton, setSkeleton] = useState(true);
      return (
            <Link onClick={() => play("press")} className="block h-full w-full" to={`/${eachMovie.media_type || type}/details/${eachMovie.id}`}>
                  <div className="flex h-full w-full flex-col">
                        <div className="h-3/4 w-full overflow-hidden rounded-lg">
                              <AnimatePresence>{showSkeleton && <ImageLoader />} </AnimatePresence>
                              <motion.img
                                    loading="lazy"
                                    decoding="async"
                                    draggable={false}
                                    whileHover={{ scale: 1.1, transition: { ease: "circInOut" } }}
                                    onLoad={() => setSkeleton(false)}
                                    className={`h-full w-full object-cover ${showSkeleton ? "invisible" : "visible"}`}
                                    src={eachMovie.backdrop_path || eachMovie.poster_path ? `https://image.tmdb.org/t/p/w500${eachMovie?.backdrop_path || eachMovie?.poster_path}` : `/noImage.jpg`}
                                    alt={eachMovie.title || eachMovie.original_title || eachMovie.name || ""}
                              />
                        </div>
                        <div className="mt-2 space-y-1">
                              <h1 className="truncate text-sm text-format">{eachMovie.title || eachMovie.original_title || eachMovie.name} </h1>
                              <p className="text-xs text-white/50">{eachMovie.release_date && eachMovie.release_date.split("-")[0]}</p>
                              <p className="text-xs">⭐{eachMovie.vote_average && eachMovie.vote_average.toFixed(1)}</p>
                        </div>
                  </div>
            </Link>
      );
};

export default ViewCard;
