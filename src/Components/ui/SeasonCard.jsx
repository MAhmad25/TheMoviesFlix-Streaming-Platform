import { AnimatePresence, motion } from "motion/react";
import { memo, useState } from "react";
import ImageLoader from "./Loaders/ImageLoader";

const SeasonCard = ({ eachSeason, onClick }) => {
      const [showSkeleton, setSkeleton] = useState(true);
      return (
            <button onClick={onClick} className="w-32 md:w-52  md:h-full flex h-3/4 flex-col gap-1 shrink-0">
                  <div className="w-full rounded-md overflow-hidden h-[80%]">
                        <AnimatePresence>{showSkeleton && <ImageLoader />} </AnimatePresence>
                        <motion.img loading="lazy" decoding="async" whileHover={{ scale: 1.1, transition: { ease: "circInOut" } }} onLoad={() => setSkeleton(false)} className={`w-full ${showSkeleton ? "invisible" : "visible"} h-full object-cover`} src={eachSeason.poster_path ? `https://image.tmdb.org/t/p/original${eachSeason.poster_path}` : `/noImage.jpg`} alt={eachSeason?.name} />
                  </div>
                  <div className="w-full  flex flex-col gap-2">
                        <h1 className="text-sm tracking-tight leading-none">{eachSeason.name}</h1>
                  </div>
            </button>
      );
};

export default memo(SeasonCard);
