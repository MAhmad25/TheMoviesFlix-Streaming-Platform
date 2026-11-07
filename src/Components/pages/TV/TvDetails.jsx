import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncTvLoader, removeTv } from "../../../store/actions/tvAction";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { MdClose } from "react-icons/md";
import Card from "../../ui/Card";
import Review from "../../ui/Review";
import DetailLoader, { DetailLoadError } from "../../ui/Loaders/DetailLoader";
import Exclude from "../../ui/Exclude";
import { Carousel, CarouselContent, CarouselIndicator, CarouselItem, CarouselNavigation } from "../../ui/Carousel";
import TVSeasonModal from "./TVSeasonModal";
import MediaActions from "../../ui/MediaActions";
import DetailHero from "../../ui/DetailHero";
import AccordionCarousel from "../../ui/AccordionCarousel";
import { Button } from "glisse";
const TvDetails = () => {
      const [selectedSeason, setSelectedSeason] = useState(null);
      const [seasonModalOpen, setSeasonModalOpen] = useState(false);
      const openSeason = useCallback((season) => {
            if (!season) return;
            setSelectedSeason(season);
            setSeasonModalOpen(true);
      }, []);
      const closeSeason = useCallback(() => setSeasonModalOpen(false), []);
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
      const [showAllRecommendations, setShowAllRecommendations] = useState(false);
      useEffect(() => {
            const controller = new AbortController();
            setLoadError(false);
            setSeasonModalOpen(false);
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
                              <TVSeasonModal open={seasonModalOpen} onClose={closeSeason} season={selectedSeason} mediaId={id} title={info.detail.name || info.detail.original_name} seriesTrailer={info.videoLink} />
                              <Button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="detail-close" icon={<MdClose size="1.5rem" />} tint="#ffffff" />
                              <section className="overflow-x-hidden relative overflow-hidden w-full min-h-screen">
                                    <DetailHero detail={info.detail} mediaType="tv">
                                          <MediaActions mediaId={id} mediaType="tv" title={info.detail.name || info.detail.original_name} showWatch={Boolean(firstSeason)} onWatch={() => openSeason(firstSeason)} season={firstSeason?.season_number ?? 1} />
                                    </DetailHero>
                                    <section className="detail-supporting-content px-4 sm:px-5 pb-28 text-white w-full font-primary">
                                          {info.detail.seasons.length != 0 && (
                                                <div className="detail-content-section w-full md:flex md:justify-center rounded-md md:items-center md:flex-col">
                                                      <h2 className="text-white text-left md:text-center text-2xl md:text-3xl lg:text-4xl font-bold font-primary leading-none">Watch a Season</h2>
                                                      <div className="mt-4 h-[300px] w-full sm:h-[340px] lg:h-[380px]">
                                                            <AccordionCarousel seasons={info.detail.seasons} onOpenSeason={openSeason} initialIndex={Math.max(firstSeasonIndex, 0)} />
                                                      </div>
                                                </div>
                                          )}
                                          {info.castBy.cast.length !== 0 && (
                                                <div className="detail-content-section w-full mt-10">
                                                      <h2 className="text-white text-2xl md:text-center min-[961px]:text-5xl md:text-4xl font-bold font-primary leading-none">Cast</h2>
                                                      <Carousel className="mt-6">
                                                            <CarouselContent>
                                                                  {info.castBy.cast.slice(0, 12).map((eachActor, index) => (
                                                                        <CarouselItem key={eachActor.cast_id ?? index} className="w-1/3 px-1.5 sm:w-1/4 sm:px-2 md:w-1/5 xl:w-1/6">
                                                                              <Exclude eachActor={eachActor} />
                                                                        </CarouselItem>
                                                                  ))}
                                                            </CarouselContent>
                                                            <CarouselNavigation />
                                                            <CarouselIndicator />
                                                      </Carousel>
                                                </div>
                                          )}
                                          {info.castBy.crew.length !== 0 && (
                                                <div className="detail-content-section mt-8 border-b-[0.5px] border-zinc-300/70 pb-5 w-full">
                                                      <h2 className="text-white text-2xl md:text-center md:text-4xl min-[961px]:text-5xl font-bold font-primary leading-none">Crew</h2>
                                                      <Carousel className="mt-6">
                                                            <CarouselContent>
                                                                  {info.castBy.crew.slice(0, 9).map((eachActor, index) => (
                                                                        <CarouselItem key={eachActor.credit_id ?? index} className="w-1/3 px-1.5 sm:w-1/4 sm:px-2 md:w-1/5 xl:w-1/6">
                                                                              <Exclude eachActor={eachActor} />
                                                                        </CarouselItem>
                                                                  ))}
                                                            </CarouselContent>
                                                            <CarouselNavigation />
                                                            <CarouselIndicator />
                                                      </Carousel>
                                                </div>
                                          )}
                                          {info.reviews.length !== 0 && (
                                                <div className="detail-content-section mt-8 border-b-[0.5px] relative border-zinc-300/70 pb-5 w-full">
                                                      <div className="detail-reviews__header">
                                                            <h2 className="text-white text-2xl md:text-4xl min-[961px]:text-5xl font-bold font-primary">Reviews</h2>
                                                            <p className="text-white text-sm md:text-lg">{info.reviews.length} comments</p>
                                                      </div>
                                                      <Carousel className="mt-4">
                                                            <CarouselContent>
                                                                  {info.reviews.map((eachReview) => (
                                                                        <CarouselItem key={eachReview.id} className="h-[260px] w-[85%] px-1.5 sm:w-[60%] sm:px-2 md:h-[320px] md:w-[55%] lg:w-[45%] xl:w-[38%]">
                                                                              <Review review={eachReview} />
                                                                        </CarouselItem>
                                                                  ))}
                                                            </CarouselContent>
                                                            <CarouselNavigation />
                                                            <CarouselIndicator />
                                                      </Carousel>
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
