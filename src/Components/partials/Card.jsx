/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import ImageLoader from "./ImageLoader";
import { useState } from "react";
import { motion } from "motion/react";

const Card = ({ eachMovie, type = "all" }) => {
      const [showSkeleton, setSkeleton] = useState(true);
      return (
            <Link to={`/${eachMovie.media_type || type}/details/${eachMovie.id}`}>
                  <section className="w-44 relative sm:w-full sm:min-w-56 shrink-0 overflow-hidden rounded-xl sm:h-56  md:h-72 h-40">
                        {showSkeleton && <ImageLoader />}
                        <motion.img whileHover={{ scale: 1.1, transition: { duration: 0.8 } }} onLoad={() => setSkeleton(false)} className={`w-full ${showSkeleton ? "invisible" : "visible"} h-full object-cover`} src={eachMovie.backdrop_path || eachMovie.poster_path || eachMovie.profile_path ? `https://image.tmdb.org/t/p/original${eachMovie.backdrop_path || eachMovie.poster_path || eachMovie.profile_path}` : `/noImage.jpg`} alt="" />
                  </section>
                  <div className="mt-2  px-2 py-2 rounded-lg flex flex-col gap-1 h-fit  w-full md:w-full md:bg-transparent  text-white">
                        {eachMovie.vote_average != 0 && (
                              <h3 className="text-white rounded-full whitespace-nowrap  text-xs leading-none  tracking-tighter ">
                                    {eachMovie.vote_average && "⭐"}
                                    {eachMovie.vote_average && eachMovie.vote_average.toFixed(1)}
                              </h3>
                        )}
                        <h3 className="text-white w-full text-wrap leading-none text-sm sm:text-lg tracking-tight ">{eachMovie.name || eachMovie.title || eachMovie.original_title}</h3>
                        <p className="w-full  leading-3 text-xs sm:text-sm text-zinc-300">{eachMovie.overview && eachMovie.overview.slice(0, 60)}</p>
                  </div>
            </Link>
      );
};
export default Card;
