import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Rise } from "cube-motion/react";
import { CalendarDays, Clapperboard, Clock3, SquarePlay, X } from "lucide-react";
import api from "../../../utils/axios";
import { pickYouTubeTrailer } from "../../../utils/tmdbVideos";
import StarIcon from "../../ui/Icons/StarIcon";
import MediaActions from "../../ui/MediaActions";
import MediaActionButton from "../../ui/MediaActionButton";

const EpisodeCard = ({ episode, active, onSelect }) => {
      const number = Number(episode.episode_number) || 0;
      const date = episode.air_date
            ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${episode.air_date}T00:00:00`))
            : "Air date unavailable";
      const runtime = Number(episode.runtime);

      return (
            <button
                  type="button"
                  onClick={() => onSelect(number)}
                  aria-pressed={active}
                  aria-label={`Select episode ${number}: ${episode.name || "Untitled episode"}`}
                  className={`tv-season-episode${active ? " is-active" : ""}`}
            >
                  <span className="tv-season-episode__artwork">
                        <img
                              src={episode.still_path ? `https://image.tmdb.org/t/p/w300${episode.still_path}` : "/noImage.jpg"}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              sizes="(max-width: 640px) 80vw, 330px"
                        />
                        <span className="tv-season-episode__number">E{String(number).padStart(2, "0")}</span>
                  </span>
                  <span className="tv-season-episode__body">
                        <strong>{episode.name || `Episode ${number}`}</strong>
                        <span className="tv-season-episode__meta">
                              <span><CalendarDays aria-hidden="true" size={13} />{date}</span>
                              {runtime > 0 && <span><Clock3 aria-hidden="true" size={13} />{runtime} min</span>}
                              {Number(episode.vote_average) > 0 && <span><StarIcon />{Number(episode.vote_average).toFixed(1)}</span>}
                        </span>
                        {episode.overview && <span className="tv-season-episode__overview">{episode.overview}</span>}
                        {episode.guest_stars?.length > 0 && (
                              <span className="tv-season-episode__guests">Guest starring {episode.guest_stars.slice(0, 2).map((person) => person.name).filter(Boolean).join(" · ")}</span>
                        )}
                  </span>
            </button>
      );
};

const EpisodeSelector = ({ totalEpisodes, currentEpisode, setEpisode }) => (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-2">
            {Array.from({ length: totalEpisodes }, (_, index) => {
                  const episodeNumber = index + 1;
                  return (
                        <button
                              key={episodeNumber}
                              type="button"
                              onClick={() => setEpisode(episodeNumber)}
                              aria-pressed={currentEpisode === episodeNumber}
                              aria-label={`Select episode ${episodeNumber}`}
                              className={`min-h-11 rounded-md border px-3 font-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--txt)] ${currentEpisode === episodeNumber ? "border-[var(--txt)] bg-[var(--txt)] text-[#300b07]" : "border-[#ff7949]/30 text-[var(--txt)] hover:bg-[#ff7949]/10"}`}
                        >
                              {episodeNumber}
                        </button>
                  );
            })}
      </div>
);

const TVSeasonModal = ({ season, open, onClose, mediaId, title, seriesTrailer }) => {
      const [currentEpisode, setCurrentEpisode] = useState(1);
      const [seasonDetails, setSeasonDetails] = useState(null);
      const [loadState, setLoadState] = useState("loading");
      const [retryToken, setRetryToken] = useState(0);
      const [showAllEpisodes, setShowAllEpisodes] = useState(false);
      const dialogRef = useRef(null);
      const seasonNumber = season ? Number(season.season_number) : NaN;

      useEffect(() => {
            if (!open || !Number.isFinite(seasonNumber)) return undefined;

            const previousFocus = document.activeElement;
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            const focusFrame = window.requestAnimationFrame(() => dialogRef.current?.focus({ preventScroll: true }));

            const handleKeyDown = (event) => {
                  const dialog = dialogRef.current;
                  if (!dialog || event.target.closest('[role="dialog"]') !== dialog) return;

                  if (event.key === "Escape") {
                        event.preventDefault();
                        onClose();
                        return;
                  }

                  if (event.key !== "Tab") return;
                  const controls = Array.from(dialog.querySelectorAll("button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex='-1'])"));
                  const first = controls[0];
                  const last = controls[controls.length - 1];
                  if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
                        event.preventDefault();
                        last?.focus();
                  } else if (!event.shiftKey && document.activeElement === last) {
                        event.preventDefault();
                        first?.focus();
                  }
            };

            document.addEventListener("keydown", handleKeyDown);
            return () => {
                  window.cancelAnimationFrame(focusFrame);
                  document.removeEventListener("keydown", handleKeyDown);
                  document.body.style.overflow = previousOverflow;
                  if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
            };
      }, [open, onClose, seasonNumber]);

      useEffect(() => {
            if (!open) return undefined;
            if (!Number.isFinite(seasonNumber)) {
                  setLoadState("error");
                  return undefined;
            }

            const controller = new AbortController();
            setLoadState("loading");
            setSeasonDetails(null);
            setCurrentEpisode(1);
            setShowAllEpisodes(false);

            api.get(`/tv/${mediaId}/season/${seasonNumber}`, {
                  params: {
                        append_to_response: "videos,images",
                        include_image_language: "en,en-US,null",
                  },
                  signal: controller.signal,
            }).then(({ data }) => {
                  if (controller.signal.aborted) return;
                  setSeasonDetails(data);
                  setCurrentEpisode(Number(data.episodes?.[0]?.episode_number) || 1);
                  setLoadState("loaded");
            }).catch(() => {
                  if (!controller.signal.aborted) setLoadState("error");
            });

            return () => controller.abort();
      }, [mediaId, open, retryToken, seasonNumber]);

      const episodes = seasonDetails?.episodes || [];
      const selectedEpisode = episodes.find((episode) => Number(episode.episode_number) === currentEpisode) || episodes[0];
      const episodeCount = episodes.length || Number(season?.episode_count) || 0;
      const posters = seasonDetails?.images?.posters || [];
      const posterPath = seasonDetails?.poster_path || posters[0]?.file_path || season?.poster_path;
      const seasonTrailer = pickYouTubeTrailer(seasonDetails?.videos?.results);
      const trailer = seasonTrailer || seriesTrailer;
      const trailerLabel = seasonTrailer ? `Season ${seasonNumber} trailer` : "Series trailer";
      const visibleEpisodes = showAllEpisodes ? episodes : episodes.slice(0, 8);

      return (
            <div
                  className={`tv-season-backdrop${open ? " is-open" : ""}`}
                  aria-hidden={!open}
                  inert={!open}
                  onClick={(event) => {
                        if (event.target === event.currentTarget && open) onClose();
                  }}
            >
                  <Rise
                        as="section"
                        show={open}
                        role="dialog"
                        ref={dialogRef}
                        tabIndex={-1}
                        data-lenis-prevent
                        aria-modal="true"
                        aria-label={`${season?.name || `Season ${seasonNumber}`} details`}
                        className="tv-season-dialog"
                  >
                        <div className="fdg-gradient" aria-hidden="true" />
                        <button type="button" aria-label="Close season details" onClick={onClose} className="tv-season-dialog__close">
                              <X size={20} aria-hidden="true" />
                        </button>
                        <div className="tv-season-dialog__scroll" data-lenis-prevent>
                              <div className="tv-season-summary">
                                    <img
                                          className="tv-season-summary__poster"
                                          src={posterPath ? `https://image.tmdb.org/t/p/w342${posterPath}` : "/noImage.jpg"}
                                          alt={`${season?.name || `Season ${seasonNumber}`} poster`}
                                          loading="lazy"
                                          decoding="async"
                                    />
                                    <div className="tv-season-summary__content">
                                          <p className="tv-season-summary__label">{title || "Series"}</p>
                                          <h2>{season?.name || `Season ${seasonNumber}`}</h2>
                                          <p className="tv-season-summary__metadata">
                                                <span>{episodeCount} {episodeCount === 1 ? "episode" : "episodes"}</span>
                                                {seasonDetails?.air_date && <span>{seasonDetails.air_date.slice(0, 4)}</span>}
                                                {Number(seasonDetails?.vote_average || season?.vote_average) > 0 && (
                                                      <span><StarIcon />{Number(seasonDetails?.vote_average || season?.vote_average).toFixed(1)} season rating</span>
                                                )}
                                          </p>
                                          <p className="tv-season-summary__overview">{seasonDetails?.overview || season?.overview || "Season information is not available yet."}</p>
                                          {trailer && (
                                                <MediaActionButton
                                                      as={Link}
                                                      to="trailer"
                                                      state={{ video: trailer, seasonNumber, trailerScope: seasonTrailer ? "season" : "series" }}
                                                      label={`Watch ${trailerLabel}`}
                                                      icon={Clapperboard}
                                                      activeIcon={SquarePlay}
                                                      className="tv-season-trailer-button"
                                                />
                                          )}
                                    </div>
                              </div>

                              <section className="tv-season-episodes" aria-labelledby="tv-season-episodes-heading">
                                    <div className="tv-season-episodes__heading">
                                          <div>
                                                <h3 id="tv-season-episodes-heading">Episodes</h3>
                                                <p>Choose an episode to continue watching.</p>
                                          </div>
                                          <span>{episodeCount} total</span>
                                    </div>

                                    {loadState === "loading" && <p className="tv-season-status" role="status">Loading episode artwork and details…</p>}
                                    {loadState === "error" && (
                                          <div className="tv-season-status tv-season-status--error" role="alert">
                                                <span>Season episodes could not be loaded. You can still choose an episode number.</span>
                                                <button type="button" onClick={() => setRetryToken((token) => token + 1)}>Retry</button>
                                          </div>
                                    )}

                                    {episodes.length > 0 ? (
                                          <div className="tv-season-episode-grid">
                                                {visibleEpisodes.map((episode) => (
                                                      <EpisodeCard
                                                            key={episode.id || `${seasonNumber}-${episode.episode_number}`}
                                                            episode={episode}
                                                            active={Number(episode.episode_number) === Number(selectedEpisode?.episode_number)}
                                                            onSelect={setCurrentEpisode}
                                                      />
                                                ))}
                                          </div>
                                    ) : loadState !== "loading" ? (
                                          <EpisodeSelector totalEpisodes={episodeCount} currentEpisode={currentEpisode} setEpisode={setCurrentEpisode} />
                                    ) : null}

                                    {episodes.length > 8 && (
                                          <button type="button" className="tv-season-show-all" onClick={() => setShowAllEpisodes((show) => !show)}>
                                                {showAllEpisodes ? "Show fewer episodes" : `Show all ${episodes.length} episodes`}
                                          </button>
                                    )}
                              </section>

                              <div className="tv-season-dialog__actions">
                                    <MediaActions
                                          mediaId={mediaId}
                                          mediaType="tv"
                                          title={title}
                                          watchTo={`watch/${seasonNumber}/${selectedEpisode?.episode_number || currentEpisode}`}
                                          season={seasonNumber}
                                          episode={selectedEpisode?.episode_number || currentEpisode}
                                          showTrailer={false}
                                    />
                              </div>
                        </div>
                  </Rise>
            </div>
      );
};

export default TVSeasonModal;
