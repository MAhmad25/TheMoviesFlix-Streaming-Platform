import { motion } from "motion/react";
import { memo } from "react";

const SeasonCard = ({ eachSeason, onClick }) => {
      return (
            <button onClick={onClick} className="w-32 md:w-52  md:h-full flex h-3/4 flex-col gap-1 shrink-0">
                  <div className="w-full rounded-md overflow-hidden h-[80%]">
                        <motion.img loading="lazy" decoding="async" whileHover={{ scale: 1.1, transition: { ease: "circInOut" } }} className="w-full  h-full object-cover" src={eachSeason.poster_path ? `https://image.tmdb.org/t/p/w500${eachSeason.poster_path}` : `/noImage.jpg`} alt={eachSeason?.name} />
                  </div>
                  <div className="w-full  flex flex-col gap-2">
                        <h1 className="text-sm tracking-tight leading-none">{eachSeason.name}</h1>
                  </div>
            </button>
      );
};

export default memo(SeasonCard);
