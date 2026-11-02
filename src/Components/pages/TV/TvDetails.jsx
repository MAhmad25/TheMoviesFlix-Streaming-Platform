import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncTvLoader, removeTv } from "../../../store/actions/tvAction";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { MdClose } from "react-icons/md";
import Card from "../../ui/Card";
import Review from "../../ui/Review";
import DetailLoader, { DetailLoadError } from "../../ui/Loaders/DetailLoader";
import Exclude from "../../ui/Exclude";
import { CoverFlow } from "../../ui/Coverflow";
import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";
import TVSeasonModal from "./TVSeasonModal";
import MediaActions from "../../ui/MediaActions";
import DetailHero from "../../ui/DetailHero";
import { Button } from "glisse";
const TvDetails = () => {
      const [selectedSeason, setSelectedSeason] = useState(null);
      const closeSeason = useCallback(() => setSelectedSeason(null), []);
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const info = useSelector((state) => state.tv.info);
      const firstSeason = info?.detail?.seasons?.find((season) => season.season_number > 0 && season.episode_count > 0) || info?.detail?.seasons?.find((season) => season.episode_count > 0);
      const firstSeasonIndex = info?.detail?.seasons?.findIndex((season) => season === firstSeason) ?? 0;
      const [loadError, setLoadError] = useState(false);
      const [retryToken, setRetryToken] = useState(0);
      useEffect(() => {
            const title = info?.detail?.name || info?.detail?.original_name || "Hang On ! Getting Details for The Requested TV Series";
            if (title) document.title = title;
      }, [info?.detail?.name, info?.detail?.original_name]);
      const { id } = useParams();
      const containerRef = useRef(null);
      const rafRef = useRef(null);
      const [isEnd, setIsEnd] = useState(false);
      const [isStart, setIsStart] = useState(true);
      const [showAllReviews, setShowAllReviews] = useState(false);
      const [showAllRecommendations, setShowAllRecommendations] = useState(false);
      const updateScrollState = useCallback(() => {
            const el = containerRef.current;
            if (!el) return;
            const { scrollLeft, clientWidth, scrollWidth } = el;
            setIsStart(scrollLeft <= 0);
            setIsEnd(scrollLeft + clientWidth >= scrollWidth - 1);
      }, []);
      const scrollLeft = useCallback(() => {
            if (!containerRef.current) return;
            const behavior = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ? "auto" : "smooth";
            containerRef.current.scrollBy({ left: -600, behavior });
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateScrollState);
      }, [updateScrollState]);

      const scrollRight = useCallback(() => {
            if (!containerRef.current) return;
            const behavior = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ? "auto" : "smooth";
            containerRef.current.scrollBy({ left: 600, behavior });
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateScrollState);
      }, [updateScrollState]);

      useEffect(() => {
            const el = containerRef.current;
            if (!el) return;
            const onScroll = () => {
                  if (rafRef.current) cancelAnimationFrame(rafRef.current);
                  rafRef.current = requestAnimationFrame(updateScrollState);
            };
            el.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", onScroll);
            updateScrollState();
            return () => {
                  el.removeEventListener("scroll", onScroll);
                  window.removeEventListener("resize", onScroll);
                  if (rafRef.current) cancelAnimationFrame(rafRef.current);
            };
      }, [updateScrollState, info]);
      useEffect(() => {
            const controller = new AbortController();
            setLoadError(false);
            setSelectedSeason(null);
            setShowAllReviews(false);
            setShowAllRecommendations(false);
            dispatch(asyncTvLoader(id, controller.signal)).catch(() => {
                  if (!controller.signal.aborted) {
                        controller.abort();
                        setLoadError(true);
                  }
            });
            return () => {
                  controller.abort();
                  dispatch(removeTv());
            };
      }, [id, retryToken, dispatch]);
      return (
            <>
                  {info ? (
                        <section className="w-full overflow-x-hidden bg-bottom [background-image:var(--bg-gradient)]">
                              {selectedSeason && <TVSeasonModal onClick={closeSeason} season={selectedSeason} mediaId={id} title={info.detail.name || info.detail.original_name} seriesTrailer={info.videoLink} />}
                              <Button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="detail-close" icon={<MdClose size="1.5rem" />} tint="#ffffff" />
                              <section className="overflow-x-hidden relative overflow-hidden w-full min-h-screen">
                                    <DetailHero detail={info.detail} mediaType="tv">
                                          <MediaActions mediaId={id} mediaType="tv" title={info.detail.name || info.detail.original_name} showWatch={Boolean(firstSeason)} onWatch={() => setSelectedSeason(firstSeason)} season={firstSeason?.season_number ?? 1} />
                                    </DetailHero>
                                    <section className="detail-supporting-content px-5 pb-28 text-white w-full font-primary">
                                          {info.detail.seasons.length != 0 && (
                                                <div className="detail-content-section w-full md:flex md:justify-center rounded-md md:items-center md:flex-col">
                                                      <h2 className="text-white text-center text-2xl md:text-3xl lg:text-4xl font-bold font-primary leading-none">Watch a Season</h2>
                                                      <div className="flex mt-2 items-center w-full cursor-pointer justify-center-safe [&::-webkit-scrollbar]:hidden gap-3 h-[360px] md:h-[460px]">
                                                            <CoverFlow items={info?.detail?.seasons} setSeason={setSelectedSeason} initialIndex={Math.max(firstSeasonIndex, 0)} showNavigation className="h-full" />
                                                      </div>
                                                </div>
                                          )}
                                          {info.castBy.cast.length != 0 && (
                                                <div className="detail-content-section w-full mt-10">
                                                      <h2 className="text-white text-2xl md:text-center min-[961px]:text-5xl md:text-4xl font-bold font-primary leading-none">Cast</h2>
                                                      <div className="detail-people">
                                                            {info.castBy.cast.slice(0, 12).map((eachActor, index) => (
                                                                  <Exclude key={index} eachActor={eachActor} />
                                                            ))}
                                                      </div>
                                                </div>
                                          )}
                                          {info.castBy.crew.length != 0 && (
                                                <div className="detail-content-section mt-8 border-b-[0.5px] border-zinc-300/70 pb-5 w-full">
                                                      <h2 className="text-white text-2xl md:text-center md:text-4xl min-[961px]:text-5xl font-bold font-primary leading-none">Crew</h2>
                                                      <div className="detail-people">{info.castBy.crew.map((eachActor, index) => <Exclude key={index} eachActor={eachActor} />).slice(0, 9)}</div>
                                                </div>
                                          )}
                                          {info.reviews.length !== 0 && (
                                                <div className="detail-content-section mt-8 border-b-[0.5px] relative border-zinc-300/70 pb-5 w-full">
                                                      <div className="detail-reviews__header">
                                                            <h2 className="text-white text-2xl md:text-4xl min-[961px]:text-5xl font-bold font-primary">Reviews</h2>
                                                            <div className="detail-reviews__tools">
                                                                  <p className="text-white text-sm md:text-lg">{info.reviews.length} comments</p>
                                                                  <button type="button" onClick={scrollLeft} disabled={isStart} aria-label="Previous reviews" className="detail-reviews__arrow">
                                                                        <CiCircleChevLeft size="2rem" />
                                                                  </button>
                                                                  <button type="button" onClick={scrollRight} disabled={isEnd} aria-label="Next reviews" className="detail-reviews__arrow">
                                                                        <CiCircleChevRight size="2rem" />
                                                                  </button>
                                                            </div>
                                                      </div>
                                                      <div ref={containerRef} className="detail-reviews__rail">
                                                            {info.reviews && (showAllReviews ? info.reviews : info.reviews.slice(0, 8)).map((eachReview) => <Review review={eachReview} key={eachReview.id} />)}
                                                      </div>
                                                      {info.reviews.length > 8 && (
                                                            <div className="mt-3 flex justify-center">
                                                                  <button onClick={() => setShowAllReviews((s) => !s)} className="px-4 py-2 rounded-md bg-white/10 text-white">
                                                                        {showAllReviews ? "Show fewer reviews" : `Show all ${info.reviews.length} reviews`}
                                                                  </button>
                                                            </div>
                                                      )}
                                                </div>
                                          )}
                                          {/* Recommend TV List */}
                                          {info.recommendedTv.length != 0 && (
                                                <div className="detail-content-section mt-8 overflow-x-hidden mb-20 w-full">
                                                      <h2 className="text-white text-2xl md:text-3xl min-[961px]:text-5xl md:my-10 font-bold font-primary leading-none">Similar TV Series</h2>
                                                      <div className="media-grid recommendations-grid mt-5 sm:mt-3 w-full grid grid-cols-2 lg:grid-cols-3 min-[1250px]:grid-cols-4 gap-3 md:gap-6 items-stretch">
                                                            {(showAllRecommendations ? info.recommendedTv : info.recommendedTv.slice(0, 12)).map((eachTv) => (
                                                                  <Card key={eachTv.id} type="tv" eachMovie={eachTv} />
                                                            ))}
                                                      </div>
                                                      {info.recommendedTv.length > 12 && (
                                                            <div className="mt-3 flex justify-center">
                                                                  <Button onClick={() => setShowAllRecommendations((s) => !s)} className="glass-action">
                                                                        {showAllRecommendations ? "Show fewer" : `Show all ${info.recommendedTv.length}`}
                                                                  </Button>
                                                            </div>
                                                      )}
                                                </div>
                                          )}
                                    </section>
                                    <Outlet />
                              </section>
                        </section>
                  ) : loadError ? (
                        <DetailLoadError onRetry={() => setRetryToken((token) => token + 1)} />
                  ) : (
                        <DetailLoader />
                  )}
            </>
      );
};

export default TvDetails;
