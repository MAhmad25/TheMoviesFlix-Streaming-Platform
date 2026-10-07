import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { StarIcon } from "../../ui/index";
import MediaActions from "../../ui/MediaActions";
import { motion } from "motion/react";

const DropArea = styled(motion.div)`
      display: flex;
      flex-direction: column;
      border: 2px dashed #ffffff;
      border-radius: 12px;
      padding: 16px;
      position: relative;
      overflow: hidden;
      background-image: var(--bg-gradient);

      @media (min-width: 768px) {
            padding: 24px;
      }
`;

const PreviewBox = styled.div`
      border-radius: inherit;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      font-size: 11px;
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

const TVSeasonModal = ({ season, onClick, mediaId, title }) => {
      const [currentEpisode, setCurrentEpisode] = useState(1);
      const dialogRef = useRef(null);
      const totalEpisodes = season?.episode_count || 1;
      useEffect(() => {
            const dialog = dialogRef.current;
            const trigger = document.activeElement;
            dialog?.focus({ preventScroll: true });
            const handleKeyDown = (event) => {
                  if (event.defaultPrevented || event.target.closest('[role="dialog"]') !== dialog) return;
                  if (event.key === "Escape") {
                        event.preventDefault();
                        onClick();
                  }
                  if (event.key === "Tab") {
                        const controls = Array.from(dialog.querySelectorAll("button:not(:disabled), a[href]"));
                        const first = controls[0];
                        const last = controls[controls.length - 1];
                        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
                              event.preventDefault();
                              last?.focus();
                        } else if (!event.shiftKey && document.activeElement === last) {
                              event.preventDefault();
                              first?.focus();
                        }
                  }
            };
            document.addEventListener("keydown", handleKeyDown);
            return () => {
                  document.removeEventListener("keydown", handleKeyDown);
                  if (trigger?.isConnected) trigger.focus({ preventScroll: true });
            };
      }, [onClick]);

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
                  className="fixed inset-0 z-40 flex  items-center justify-center w-full h-full"
            >
                  <DropArea
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                              duration: 0.8,
                              ease: [0, 0.71, 0.2, 1.01],
                        }}
                        role="dialog"
                        ref={dialogRef}
                        tabIndex={-1}
                        data-lenis-prevent
                        aria-modal="true"
                        aria-label={season?.name || "Select episode"}
                        className="w-[calc(100%-32px)] max-w-5xl max-h-[calc(100dvh-32px)]"
                  >
                        <button type="button" aria-label="Close season" onClick={onClick} className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--txt)]">
                              <MdClose size="1.5rem" />
                        </button>
                        <PreviewBox className="relative flex flex-col w-full min-w-0 gap-6 md:flex-row md:items-start" data-lenis-prevent>
                              <img className="block w-full max-h-[45dvh] object-contain shrink-0 md:w-1/3" src={season?.poster_path ? `https://image.tmdb.org/t/p/original${season.poster_path}` : "/noImage.jpg"} alt={season?.name} />

                              <div className="w-full min-w-0 md:flex-1">
                                    <div className="w-full space-y-4 text-lg text-[#fefefe] break-words">
                                          <h2 className="w-fit max-w-full text-3xl border-b-2 border-dashed md:max-w-[calc(100%-56px)]">{season?.name}</h2>

                                          <div className="flex flex-wrap items-center gap-2">
                                                <span title="episode" className="flex items-center w-fit p-2 rounded-md bg-[#ff7949]/10">
                                                      <span className="pr-1 text-sm font-bold text-[var(--txt)]">Total Episodes: {season?.episode_count || 0}</span>
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

                                          <MediaActions mediaId={mediaId} mediaType="tv" title={title} watchTo={`watch/${season.season_number}/${currentEpisode}`} showTrailer={false} season={season.season_number} episode={currentEpisode} />
                                    </div>
                              </div>
                        </PreviewBox>
                  </DropArea>
            </div>
      );
};

export default TVSeasonModal;

const SwitchControl = ({ label, value, checked, disabled = false, icon, onClick }) => {
      return (
            <button type="button" disabled={disabled} aria-pressed={checked} className={`flex min-h-11 min-w-11 items-center justify-center px-3 font-primary rounded-md border border-[#ff7949]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--txt)] ${checked ? "bg-[var(--txt)] text-[#300b07]" : "text-[var(--txt)] hover:bg-[#ff7949]/10"} disabled:opacity-50 disabled:cursor-not-allowed`} onClick={() => onClick(value)}>
                  {icon || label}
            </button>
      );
};

export const Switch = ({ children, value, onChange, size = "medium", style }) => {
      const getContainerClasses = () => {
            let classes = "grid gap-2 grid-cols-[repeat(auto-fit,minmax(44px,1fr))] h-fit";
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
            <div className="w-full min-w-0">
                  <Switch value={currentEpisode} onChange={setEpisode} size="medium">
                        {Array.from({ length: totalEpisodes }, (_, index) => {
                              const episodeNumber = index + 1;
                              return <Switch.Control key={episodeNumber} label={episodeNumber.toString()} value={episodeNumber} />;
                        })}
                  </Switch>
            </div>
      );
};
