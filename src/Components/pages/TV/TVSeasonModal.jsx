import styled from "styled-components";
import { useState } from "react";
import { StarIcon, WatchIcon } from "../../ui/index";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
const TVSeasonModal = ({ season, onClick }) => {
      const [currentEpisode, setCurrentEpisode] = useState(1);
      const totalEpisodes = season?.episode_count || 1;
      return (
            <StyledWrapper>
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
                        className="container w-full h-full fixed z-40 flex justify-center items-center inset-0"
                  >
                        <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                    duration: 0.8,
                                    ease: [0, 0.71, 0.2, 1.01],
                              }}
                              className="drop-area [&::-webkit-scrollbar]:hidden max-w-[90%]  lg:min-w-[30rem] lg:min-h-96"
                        >
                              <div className="[background-image:var(--bg-gradient)]">
                                    <div className="preview-box relative flex flex-col [&::-webkit-scrollbar]:hidden lg:flex-row  w-full  h-96 overflow-y-scroll">
                                          {/* Overlay */}
                                          <img className="lg:w-1/2 w-full h-full object-cover" src={season?.poster_path ? `https://image.tmdb.org/t/p/original${season?.poster_path} ` : "/noImage.jpg"} alt={season?.poster_path} />
                                          <div className="lg:w-1/2 w-full">
                                                <div className="text-[var(--txt)] text-lg space-y-4 p-5 w-full h-full">
                                                      <h2 className="text-3xl border-b-2 border-dashed w-fit">{season?.name}</h2>
                                                      <div className="flex items-center gap-1">
                                                            <span title="episode" className="cursor-pointer w-fit flex items-center fill-lime-400 bg-lime-950 hover:bg-lime-900 rounded-md duration-75 p-2">
                                                                  <span className="text-sm text-lime-400 font-bold pr-1">Total Episode: {season?.episode_count || "0"}</span>
                                                            </span>
                                                            <p className="w-fit flex items-center gap-1">
                                                                  <StarIcon /> {season?.vote_average || "Not rating"}
                                                            </p>
                                                      </div>

                                                      <p>{season?.overview}</p>
                                                      <div className="w-full max-w-4xl space-y-8">
                                                            <div>
                                                                  <h1 className="text-2xl font-bold  mb-2">Select Episode</h1>
                                                                  <EpisodeSelector totalEpisodes={totalEpisodes} currentEpisode={currentEpisode} setEpisode={setCurrentEpisode} />
                                                            </div>
                                                      </div>
                                                      <div className="mt-5 w-full flex justify-center items-center">
                                                            <Link className="bg-[#1a2e05] flex items-center gap-1 justify-center text-lime-400  px-3 py-1 rounded uppercase font-medium w-fit" to={`watch/${season.season_number}/${currentEpisode}`}>
                                                                  <WatchIcon />
                                                                  Watch
                                                            </Link>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </motion.div>
                  </div>
            </StyledWrapper>
      );
};

const StyledWrapper = styled.div`
      .container {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
      }

      .drop-area {
            border: 2px dashed #ffffff;
            border-radius: 12px;
            padding: 16px;
            position: relative;
            overflow-y: scroll;
            background-color: #1a1a1a;
      }

      .preview-box {
            background-color: linear-gradient(#14120b, rgb(26, 26, 26));
            border-radius: inherit;
            font-size: 11px;
      }
`;

export default TVSeasonModal;

const SwitchControl = ({ label, value, checked, disabled = false, size = "medium", icon, onClick }) => {
      const getSizeClasses = () => {
            if (icon) {
                  if (size === "small") return "py-1 px-2";
                  if (size === "large") return "p-3";
                  return "py-2 px-3";
            } else {
                  if (size === "small") return "text-sm px-3";
                  if (size === "large") return "text-base px-4";
                  return "text-sm px-3";
            }
      };

      return (
            <label className={`flex flex-1 h-full ${disabled ? "cursor-not-allowed pointer-events-none" : ""}`} onClick={() => !disabled && onClick(value)}>
                  <span className={`flex items-center justify-center flex-1 cursor-pointer font-medium font-sans duration-150 rounded-md ${checked ? "bg-[#1a2e05]  text-lime-400" : "text-lime-400 hover:bg-[#1a2e05]/10"} ${disabled ? "text-slate-400" : ""} ${getSizeClasses()}`}>{icon ? <span className={size === "large" ? "scale-125" : ""}>{icon}</span> : label}</span>
            </label>
      );
};

export const Switch = ({ children, value, onChange, size = "medium", style }) => {
      const getContainerClasses = () => {
            let classes = "grid grid-rows-3 grid-cols-8 gap-x-5 bg-transparent p-0 h-20";
            if (size === "small") classes += " h-8";
            else if (size === "large") classes += " h-12";
            else classes += " h-10";
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
            <div className="w-full">
                  <Switch value={currentEpisode} onChange={setEpisode} size="medium">
                        {Array.from({ length: totalEpisodes }, (_, index) => {
                              const episodeNumber = index + 1;
                              return <Switch.Control key={episodeNumber} label={episodeNumber.toString()} value={episodeNumber} />;
                        })}
                  </Switch>
            </div>
      );
};
