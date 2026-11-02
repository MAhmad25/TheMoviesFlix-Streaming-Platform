import { memo } from "react";
import { play } from "cuelume";

const SeasonCard = ({ eachSeason, onClick }) => {
      const handleClick = (event) => {
            play("press");
            onClick?.(event);
      };

      return (
            <button type="button" onClick={handleClick} aria-label={`Open ${eachSeason?.name || "season"}`} className="w-32 md:w-52 md:h-full flex h-3/4 flex-col gap-1 shrink-0 text-white">
                  <div className="w-full rounded-md overflow-hidden h-[80%]">
                        <img loading="lazy" decoding="async" width="500" height="750" className="w-full h-full object-cover" src={eachSeason.poster_path ? `https://image.tmdb.org/t/p/w500${eachSeason.poster_path}` : `/noImage.jpg`} alt="" />
                  </div>
                  <div className="w-full  flex flex-col gap-2">
                        <h3 className="text-sm font-semibold tracking-tight leading-tight text-white">{eachSeason.name}</h3>
                  </div>
            </button>
      );
};

export default memo(SeasonCard);
