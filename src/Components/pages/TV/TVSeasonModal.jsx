import styled from "styled-components";
import { useState } from "react";
import { StarIcon, WatchIcon } from "../../ui/index";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const DropArea = styled(motion.div)`
      border: 2px dashed #ffffff;
      border-radius: 12px;
      padding: 16px;
      position: relative;
      overflow-y: auto;
`;

const PreviewBox = styled.div`
      border-radius: inherit;
      font-size: 11px;
      overflow-y: auto;

      &::-webkit-scrollbar {
            width: 8px;
      }

      &::-webkit-scrollbar-thumb {
            background: #300b07;
            border-radius: 9999px;
      }

      &::-webkit-scrollbar-track {
            background: transparent;
      }

      scrollbar-width: thin;
      scrollbar-color: #fefefe transparent;
`;

const TVSeasonModal = ({ season, onClick }) => {
      const [currentEpisode, setCurrentEpisode] = useState(1);
      const totalEpisodes = season?.episode_count || 1;

      return (
            <div
                  onClick={(e) => {
                        if (e.target === e.currentTarget) {
                              onClick();
                        }
                  }}
                  style={{
                        backgroundImage: "radial-gradient(transparent 1px, #14120b 1px)",
                        backgroundSize: "3px 3px",
                        backdropFilter: "brightness(1) blur(10px)",
                        willChange: "filter, opacity, transform",
                  }}
                  className="fixed inset-0 z-40 flex items-center justify-center w-full h-full"
            >
                  <DropArea
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                              duration: 0.8,
                              ease: [0, 0.71, 0.2, 1.01],
                        }}
                        className="max-w-[90%] lg:min-w-[30rem] lg:min-h-96"
                  >
                        <div className="[background-image:var(--bg-gradient)]">
                              <PreviewBox className="relative flex flex-col w-full  h-[80dvh] lg:flex-row">
                                    <img className="w-full h-full object-contain lg:w-1/3" src={season?.poster_path ? `https://image.tmdb.org/t/p/original${season.poster_path}` : "/noImage.jpg"} alt={season?.name} />

                                    <div className="w-full lg:w-3/4">
                                          <div className="w-full h-full p-5 space-y-4 text-lg text-[#fefefe]">
                                                <h2 className="w-fit text-3xl border-b-2 border-dashed">{season?.name}</h2>

                                                <div className="flex items-center gap-1">
                                                      <span title="episode" className="flex items-center w-fit p-2 rounded-md cursor-pointer bg-lime-950 hover:bg-lime-900">
                                                            <span className="pr-1 text-sm font-bold text-lime-400">Total Episodes: {season?.episode_count || 0}</span>
                                                      </span>

                                                      <p className="flex items-center gap-1 w-fit">
                                                            <StarIcon />
                                                            {season?.vote_average || "No rating"}
                                                      </p>
                                                </div>

                                                <p>{season?.overview}</p>

                                                <div className="w-full max-w-4xl space-y-8">
                                                      <div>
                                                            <h1 className="mb-2 text-2xl font-bold">Select Episode</h1>

                                                            <EpisodeSelector totalEpisodes={totalEpisodes} currentEpisode={currentEpisode} setEpisode={setCurrentEpisode} />
                                                      </div>
                                                </div>

                                                <div className="flex items-center justify-center w-full mt-2">
                                                      <Link className="flex items-center justify-center gap-1 px-3 py-1 font-medium uppercase rounded bg-[#1a2e05] text-lime-400 w-fit" to={`watch/${season.season_number}/${currentEpisode}`}>
                                                            <WatchIcon />
                                                            Watch
                                                      </Link>
                                                </div>
                                          </div>
                                    </div>
                              </PreviewBox>
                        </div>
                  </DropArea>
            </div>
      );
};

export default TVSeasonModal;

const SwitchControl = ({ label, value, checked, disabled = false, icon, onClick }) => {
      return (
            <label className={`flex h-fit ${disabled ? "cursor-not-allowed pointer-events-none" : ""}`} onClick={() => !disabled && onClick(value)}>
                  <span className={`flex items-center justify-center w-fit px-4 cursor-pointer font-medium  duration-75 rounded-md ${checked ? "bg-[#1a2e05]  text-lime-400" : "text-lime-400 hover:bg-[#1a2e05]/10"} ${disabled ? "text-slate-400" : ""}`}>{icon ? <span>{icon}</span> : label}</span>
            </label>
      );
};

export const Switch = ({ children, value, onChange, size = "medium", style }) => {
      const getContainerClasses = () => {
            let classes = "grid [&::-webkit-scrollbar]:hidden  gap-x-5 grid-cols-5  sm:grid-cols-10  p-2 h-fit";
            return classes;
      };

      return (
            <div className={getContainerClasses()} style={style}>
                  {children.map((child, index) => {
                        if (child.type === SwitchControl) {
                              return <SwitchControl key={index} {...child.props} size={size} checked={child.props.value === value} onClick={onChange} />;
                        }
                        return child;
                  })}
            </div>
      );
};

Switch.Control = SwitchControl;

// Episode Selector Component
const EpisodeSelector = ({ totalEpisodes, currentEpisode, setEpisode }) => {
      return (
            <div className="w-full grid grid-cols-1 overflow-y-scroll [&::-webkit-scrollbar]:hidden">
                  <Switch value={currentEpisode} onChange={setEpisode} size="medium">
                        {Array.from({ length: totalEpisodes }, (_, index) => {
                              const episodeNumber = index + 1;
                              return <Switch.Control key={episodeNumber} label={episodeNumber.toString()} value={episodeNumber} />;
                        })}
                  </Switch>
            </div>
      );
};
