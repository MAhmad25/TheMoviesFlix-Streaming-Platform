import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { play } from "cuelume";
import CastLoader from "./Loaders/CastLoader";
import { motion } from "motion/react";

const Exclude = ({ eachActor }) => {
      const [showSkeleton, setSkeleton] = useState(true);
      const name = eachActor.original_name || eachActor.name || "";
      const subtitle = eachActor.character ? `as ${eachActor.character}` : eachActor.job;

      return (
            <div className="w-full min-w-0">
                  <Link onClick={() => play("press")} to={`/person/details/${eachActor.id}`} className="block">
                        <motion.div whileHover={{ scale: 0.95, opacity: 0.7, transition: { duration: 0.4 } }} className="relative aspect-square w-full overflow-hidden rounded-full bg-white/5">
                              {showSkeleton && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                          <CastLoader />
                                    </div>
                              )}
                              <img
                                    loading="lazy"
                                    decoding="async"
                                    draggable={false}
                                    onLoad={() => setSkeleton(false)}
                                    className={`h-full w-full object-cover ${showSkeleton ? "invisible" : "visible"}`}
                                    src={eachActor.profile_path ? `https://image.tmdb.org/t/p/w185${eachActor.profile_path}` : `/noImage.jpg`}
                                    alt={name}
                              />
                        </motion.div>
                        <div className="mt-3 flex w-full flex-col items-center text-center tracking-tight text-white">
                              <h3 className="w-full truncate text-sm leading-tight sm:text-base min-[961px]:text-xl">{name}</h3>
                              {subtitle && <p className="w-full truncate text-xs leading-tight text-zinc-300 sm:text-sm min-[961px]:text-base">{subtitle}</p>}
                        </div>
                  </Link>
            </div>
      );
};

export default memo(Exclude);
