import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncMovieLoader, removeMovie } from "../../../store/actions/movieAction";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { MdClose } from "react-icons/md";
import MediaActions from "../../ui/MediaActions";
import DetailHero from "../../ui/DetailHero";
import { Card, Review, Exclude, DetailLoader } from "../../ui/index";
import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";
const MovieDetails = () => {
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const containerRef = useRef(null);
      const rafRef = useRef(null);

      const info = useSelector((state) => state.movie.info);
      useEffect(() => {
            const title = info?.detail?.original_title || info?.detail?.title || "Hang On ! Getting Details for The Requested Movie";
            if (title) document.title = title;
      }, [info?.detail?.original_title, info?.detail?.title]);

      const [isEnd, setIsEnd] = useState(false);
      const [isStart, setIsStart] = useState(true);
      const [showAllReviews, setShowAllReviews] = useState(false);
      const [showAllRecommendations, setShowAllRecommendations] = useState(false);
      const { id } = useParams();
      const updateScrollState = useCallback(() => {
            const el = containerRef.current;
            if (!el) return;
            const { scrollLeft, clientWidth, scrollWidth } = el;
            setIsStart(scrollLeft <= 0);
            setIsEnd(scrollLeft + clientWidth >= scrollWidth - 1);
      }, []);

      const scrollLeft = useCallback(() => {
            if (!containerRef.current) return;
            containerRef.current.scrollBy({ left: -600, behavior: "smooth" });
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(updateScrollState);
      }, [updateScrollState]);

      const scrollRight = useCallback(() => {
            if (!containerRef.current) return;
            containerRef.current.scrollBy({ left: 600, behavior: "smooth" });
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
      }, [updateScrollState, info?.reviews, showAllReviews]);
      useEffect(() => {
            dispatch(asyncMovieLoader(id));
            return () => dispatch(removeMovie());
      }, [id, dispatch]);

      return (
            <>
                  {info ? (
                        <section className="w-full   [background-image:var(--bg-gradient)] relative overflow-x-hidden  bg-bottom ">
                              <button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="detail-close">
                                    <MdClose size="1.5rem" color="black" />
                              </button>
                              <section className="overflow-x-hidden relative overflow-hidden w-full min-h-screen ">
                                    <DetailHero detail={info.detail} mediaType="movie">
                                          <MediaActions mediaId={id} title={info.detail.title || info.detail.original_title} watchTo="watch" />
                                    </DetailHero>
                                    <section className="px-5 pb-28 text-white mt-3 w-full font-primary">
                                          <div className="detail-storyline">
                                                <div className="detail-storyline__heading">
                                                      <h1 className="text-2xl min-[961px]:text-5xl  md:text-3xl  font-medium font-astralga">Storyline</h1>
                                                      <span className="font-astralga font-semibold bg-[var(--txt)] text-[#300b07] px-3 md:text-lg text-xs py-1 rounded-full">{info.detail.release_date?.split("-")[0] || "Not Released"}</span>
                                                </div>
                                                <p className="detail-storyline__overview">{info?.detail?.overview || "No Storyline available"}</p>
                                          </div>
                                          {info.castBy.cast.length != 0 && (
                                                <div className="w-full mt-3">
                                                      <h1 className="text-white text-2xl md:text-center min-[961px]:text-5xl md:text-4xl font-bold font-primary leading-none">Cast</h1>
                                                      <div className="detail-people">{info.castBy.cast.map((eachActor) => <Exclude key={eachActor.cast_id} eachActor={eachActor} />).slice(0, 9)}</div>
                                                </div>
                                          )}
                                          {info.castBy.crew.length != 0 && (
                                                <div className="mt-2 border-b-[0.5px] border-zinc-300/70 pb-5 w-full">
                                                      <h1 className="text-white text-2xl md:text-center md:text-4xl min-[961px]:text-5xl font-bold font-primary leading-none">Crew</h1>
                                                      <div className="detail-people">{info.castBy.crew.map((eachActor, index) => <Exclude key={index} eachActor={eachActor} />).slice(0, 9)}</div>
                                                </div>
                                          )}
                                          {info.reviews.length !== 0 && (
                                                <div className="mt-2 border-b-[0.5px] relative border-zinc-300/70 pb-5 w-full">
                                                      <div className="detail-reviews__header">
                                                            <h1 className="text-white text-2xl md:text-4xl min-[961px]:text-5xl font-bold font-primary">Reviews</h1>
                                                            <div className="detail-reviews__tools">
                                                                  <p className="text-white text-sm md:text-lg">{info.reviews.length} comments</p>
                                                                  <button type="button" onClick={scrollLeft} disabled={isStart} aria-label="Previous reviews" className="detail-reviews__arrow"><CiCircleChevLeft size="2rem" /></button>
                                                                  <button type="button" onClick={scrollRight} disabled={isEnd} aria-label="Next reviews" className="detail-reviews__arrow"><CiCircleChevRight size="2rem" /></button>
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

                                          {info.recommendedMovies.length !== 0 && (
                                                <div className="mt-2 overflow-x-hidden mb-20 w-full">
                                                      <h1 className="text-white text-2xl md:text-3xl min-[961px]:text-5xl  md:my-10 font-bold font-primary leading-none">Similar Movies</h1>
                                                      <div className="mt-5 sm:mt-3 w-full overflow-x-auto md:overflow-visible [&::-webkit-scrollbar]:hidden flex md:grid md:grid-cols-2 lg:grid-cols-3 min-[1250px]:grid-cols-4 gap-3 md:gap-6 items-stretch md:items-stretch">
                                                            {(showAllRecommendations ? info.recommendedMovies : info.recommendedMovies.slice(0, 12)).map((eachMovie, index) => (
                                                                  <Card key={index} type="movie" eachMovie={eachMovie} />
                                                            ))}
                                                      </div>
                                                      {info.recommendedMovies.length > 12 && (
                                                            <div className="mt-3 flex justify-center">
                                                                  <button onClick={() => setShowAllRecommendations((s) => !s)} className="px-4 py-2 rounded-md bg-white/10 text-white">
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
                        <DetailLoader />
                  )}
            </>
      );
};

export default MovieDetails;
