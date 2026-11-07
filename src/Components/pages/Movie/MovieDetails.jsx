import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncMovieLoader, removeMovie } from "../../../store/actions/movieAction";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { MdClose } from "react-icons/md";
import MediaActions from "../../ui/MediaActions";
import DetailHero from "../../ui/DetailHero";
import Card from "../../ui/Card";
import Review from "../../ui/Review";
import Exclude from "../../ui/Exclude";
import { Carousel, CarouselContent, CarouselIndicator, CarouselItem, CarouselNavigation } from "../../ui/DetailCarousel";
import DetailLoader, { DetailLoadError } from "../../ui/Loaders/DetailLoader";
const MovieDetails = () => {
      const dispatch = useDispatch();
      const navigate = useNavigate();

      const info = useSelector((state) => state.movie.info);
      useEffect(() => {
            const title = info?.detail?.original_title || info?.detail?.title || "Hang On ! Getting Details for The Requested Movie";
            if (title) document.title = title;
      }, [info?.detail?.original_title, info?.detail?.title]);

      const [showAllRecommendations, setShowAllRecommendations] = useState(false);
      const [loadError, setLoadError] = useState(false);
      const [retryToken, setRetryToken] = useState(0);
      const { id } = useParams();
      useEffect(() => {
            const controller = new AbortController();
            setLoadError(false);
            dispatch(asyncMovieLoader(id, controller.signal)).catch(() => {
                  if (!controller.signal.aborted) {
                        controller.abort();
                        setLoadError(true);
                  }
            });
            return () => {
                  controller.abort();
                  dispatch(removeMovie());
            };
      }, [id, retryToken, dispatch]);

      return (
            <>
                  {info ? (
                        <section className="w-full   [background-image:var(--bg-gradient)] relative overflow-x-hidden  bg-bottom ">
                              <button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="detail-close"><MdClose size="1.5rem" /></button>
                              <section className="overflow-x-hidden relative overflow-hidden w-full min-h-screen ">
                                    <DetailHero detail={info.detail} mediaType="movie">
                                          <MediaActions mediaId={id} title={info.detail.title || info.detail.original_title} watchTo="watch" />
                                    </DetailHero>
                                    <section className="detail-supporting-content px-4 sm:px-5 pb-36 sm:pb-44 text-white w-full font-primary">
                                          {info.castBy.cast.length !== 0 && (
                                                <div className="detail-content-section w-full mt-10">
                                                      <h2 className="text-white text-2xl md:text-center min-[961px]:text-5xl md:text-4xl font-bold font-primary leading-none">Cast</h2>
                                                      <Carousel className="mt-6">
                                                            <CarouselContent>
                                                                  {info.castBy.cast.slice(0, 9).map((eachActor, index) => (
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

                                          {info.recommendedMovies.length !== 0 && (
                                                <div className="detail-content-section mt-8 overflow-x-hidden mb-20 w-full">
                                                      <h2 className="text-white text-2xl md:text-3xl min-[961px]:text-5xl md:my-10 font-bold font-primary leading-none">Similar Movies</h2>
                                                      <div className="media-grid recommendations-grid mt-5 sm:mt-3 w-full grid grid-cols-2 lg:grid-cols-3 min-[1250px]:grid-cols-4 gap-3 md:gap-6 items-stretch">
                                                            {(showAllRecommendations ? info.recommendedMovies : info.recommendedMovies.slice(0, 12)).map((eachMovie) => (
                                                                  <Card key={eachMovie.id} type="movie" eachMovie={eachMovie} />
                                                            ))}
                                                      </div>
                                                      {info.recommendedMovies.length > 12 && (
                                                            <div className="mt-3 flex justify-center">
                                                                  <button type="button" onClick={() => setShowAllRecommendations((s) => !s)} className="glass-action">
                                                                        {showAllRecommendations ? "Show fewer" : `Show all ${info.recommendedMovies.length}`}
                                                                  </button>
                                                            </div>
                                                      )}
                                                </div>
                                          )}
                                    </section>
                                    <Outlet />
                              </section>
                        </section>
                  ) : (
                                    loadError ? <DetailLoadError onRetry={() => setRetryToken((token) => token + 1)} /> : <DetailLoader />
                  )}
            </>
      );
};

export default MovieDetails;
