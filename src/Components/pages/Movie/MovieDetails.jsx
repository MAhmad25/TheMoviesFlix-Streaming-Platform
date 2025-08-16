import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncMovieLoader, removeMovie } from "../../../store/actions/movieAction";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { MdClose, MdLiveTv } from "react-icons/md";
import { SiTrillertv } from "react-icons/si";
import { Card, Review, Exclude, DetailLoader } from "../../ui/index";
import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";
const MovieDetails = () => {
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const containerRef = useRef(null);
      const info = useSelector((state) => state.movie.info);
      document.title = info?.detail?.title || info?.detail?.original_title || "Getting Details";
      const [isEnd, setIsEnd] = useState(false);
      const [isStart, setIsStart] = useState(true);
      const { id } = useParams();
      const scrollLeft = () => {
            if (containerRef.current) {
                  const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;
                  if (scrollLeft + clientWidth > scrollWidth) setIsEnd(true);
                  else setIsEnd(false);
                  if (scrollLeft > 0) setIsStart(false);
                  else setIsStart(true);
                  containerRef.current.scrollBy({
                        left: -600,
                        behavior: "smooth",
                  });
            }
      };
      const scrollRight = () => {
            const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;
            if (scrollLeft + clientWidth >= scrollWidth) setIsEnd(true);
            else setIsEnd(false);
            if (scrollLeft + clientWidth > 0) setIsStart(false);
            else setIsStart(true);
            if (containerRef.current) {
                  containerRef.current.scrollBy({
                        left: 600,
                        behavior: "smooth",
                  });
            }
      };
      useEffect(() => {
            dispatch(asyncMovieLoader(id));
            return () => dispatch(removeMovie());
      }, [id, dispatch]);
      return (
            <>
                  {info ? (
                        <section className="w-full relative overflow-x-hidden  bg-bottom " style={{ backgroundImage: info.detail.backdrop_path || info.detail.poster_path ? `url(https://image.tmdb.org/t/p/original${info.detail.backdrop_path || info.detail.poster_path})` : `/icon.png` }}>
                              <span onClick={() => navigate(-1)} className="absolute z-10 bg-white/30 backdrop-blur md:scale-125 rounded-full p-2 top-5 right-5">
                                    <MdClose size="1.5rem" color="black" />
                              </span>
                              <section className="backdrop-blur-2xl overflow-x-hidden relative overflow-hidden w-full   sm:min-h-[300dvh] md:min-h-[322dvh] bg-black/30">
                                    <div className="w-full relative max-h-screen overflow-hidden rounded-b-2xl">
                                          <img className="w-full h-full object-top object-cover" src={info.detail.backdrop_path || info.detail.poster_path ? `https://image.tmdb.org/t/p/original${info.detail.backdrop_path || info.detail.poster_path}` : `/noImage.jpg`} alt="Movie Poster Image" />
                                          <div className="md:absolute hidden md:block md:bg-gradient-to-t md:from-zinc-700/40  md:to-transparent md:w-full md:left-0 md:backdrop-blur-[2px] md:px-5 md:py-5 md:bottom-0 ">
                                                <h1 className="tracking-tight leading-none md:text-4xl lg:text-5xl  text-3xl text-white/95 font-primary font-semibold ">{info.detail.title || info.detail.original_title}</h1>
                                                <h3 className="text-white/70 md:text-white mt-2 text-lg md:text-lg tracking-tight leading-none">{info.detail.tagline || info.detail.status}</h3>
                                                <div className="flex mt-3 flex-wrap gap-1 w-full">
                                                      {(info.detail.runtime != 0 || info.detail.runtime != null || info.detail.runtime != undefined) && (
                                                            <h2 className="px-3 py-1 shrink-0 bg-white/10 text-sm md:text-lg text-zinc-300 md:text-white rounded-full overflow-hidden flex justify-center items-center backdrop-blur-sm">
                                                                  {Math.floor(info.detail.runtime / 60)}h {(info.detail.runtime % 60).toFixed(0)}min
                                                            </h2>
                                                      )}
                                                      {info.detail.genres.length != 0 &&
                                                            info.detail.genres.map((genre) => (
                                                                  <h2 key={genre.id} className="px-3 shrink-0 tracking-tighter leading-none py-1 bg-white/10 text-sm md:text-lg text-zinc-300 md:text-white rounded-full overflow-hidden flex justify-center items-center backdrop-blur-sm">
                                                                        {genre.name}
                                                                  </h2>
                                                            ))}
                                                </div>
                                                <div className="w-full  mt-3 flex justify-between md:justify-start md:gap-5 items-center">
                                                      <h1 className="text-white text-lg md:text-xl font-medium">
                                                            ⭐{info.detail.vote_average.toFixed(0)}/10 <span className="text-zinc-300 md:text-white md:text-sm font-normal text-xs">{info.detail.vote_count} votes</span>
                                                      </h1>
                                                      <Link to="watch" className="flex gap-1 mix-blend-difference items-center justify-center">
                                                            <MdLiveTv size="2.4rem" color={"white"} />
                                                            <p className="text-lg md:text-2xl text-white tracking-tight leading-none font-primary">Watch Full Movie</p>
                                                      </Link>
                                                      <Link to="trailer" className="flex gap-1  items-center justify-center">
                                                            <SiTrillertv size="2.4rem" color={"white"} />
                                                            <p className="text-lg md:text-2xl text-white  tracking-tight leading-none font-primary">Play Trailer</p>
                                                      </Link>
                                                </div>
                                          </div>
                                          {/* End of Overlay Part */}
                                    </div>
                                    <section className={`px-5 ${info.recommendedMovies.length == 0 && "pb-12"}  overflow-x-hidden text-white  mt-3 w-full font-Stoshi`}>
                                          {/* Start of Simple Div */}
                                          <div className="md:absolute md:hidden md:bg-gradient-to-t md:from-zinc-700/40  md:to-transparent md:w-full md:left-0 md:backdrop-blur-[2px] md:px-5 md:py-5">
                                                <h1 className="tracking-tight leading-none md:text-4xl lg:text-5xl font- font-semibold  text-3xl  ">{info.detail.title || info.detail.original_title}</h1>
                                                <h3 className="text-white/70 md:text-white mt-2 text-lg md:text-lg tracking-tight leading-none">{info.detail.tagline || info.detail.status}</h3>
                                                <div className="flex mt-3 flex-wrap gap-1 w-full">
                                                      {(info.detail.runtime != 0 || info.detail.runtime != null || info.detail.runtime != undefined) && (
                                                            <h2 className="px-3 py-1 shrink-0 bg-white/10 text-sm md:text-lg text-zinc-300 md:text-white rounded-full overflow-hidden flex justify-center items-center backdrop-blur-sm">
                                                                  {Math.floor(info.detail.runtime / 60)}h {(info.detail.runtime % 60).toFixed(0)}min
                                                            </h2>
                                                      )}
                                                      {info.detail.genres.length != 0 &&
                                                            info.detail.genres.map((genre) => (
                                                                  <h2 key={genre.id} className="px-3 shrink-0 tracking-tighter leading-none py-1 bg-white/10 text-sm md:text-lg text-zinc-300 md:text-white rounded-full overflow-hidden flex justify-center items-center backdrop-blur-sm">
                                                                        {genre.name}
                                                                  </h2>
                                                            ))}
                                                </div>
                                                <div className="w-full  mt-3 flex flex-wrap  justify-between md:justify-start md:gap-5 items-center">
                                                      <h1 className="text-white text-lg md:text-xl font-medium">
                                                            ⭐{info?.detail?.vote_average?.toFixed(0)}/10 <span className="text-zinc-300 md:text-white md:text-sm font-normal text-xs">{info.detail.vote_count} votes</span>
                                                      </h1>
                                                      <Link to="watch" className="flex gap-1 mix-blend-difference items-center justify-center">
                                                            <MdLiveTv size="2.4rem" color={"white"} />
                                                            <p className="text-lg md:text-2xl text-white tracking-tight leading-none font-primary">Watch Full Movie</p>
                                                      </Link>
                                                      <Link to="trailer" className="flex gap-1  items-center justify-center">
                                                            <SiTrillertv size="2.4rem" color={"white"} />
                                                            <p className="text-lg md:text-2xl text-white  tracking-tight leading-none font-primary">Play Trailer</p>
                                                      </Link>
                                                </div>
                                          </div>
                                          <div className="w-full text-white min-[961px]:flex min-[961px]:flex-col min-[961px]:justify-center min-[961px]:items-center font-Stoshi mt-3 border-t-[.5px] md:border-none border-zinc-300/70 py-3">
                                                <div className="flex w-full gap-2  md:justify-center items-center">
                                                      <h1 className="text-2xl min-[961px]:text-5xl  md:text-3xl md:mb-3  font-medium font-astralga">Storyline</h1>
                                                      <span className="bg-yellow-500/60 text-white backdrop-blur-sm px-3 md:text-lg text-xs py-1 rounded-full">{info.detail.release_date.split("-")[0]}</span>
                                                </div>
                                                <p className="tracking-tight min-[961px]:text-2xl min-[961px]:w-1/2 md:text-xl text-zinc-300 leading-5 font-primary">{info?.detail?.overview || "No Storyline available"}</p>
                                          </div>

                                          {info.castBy.cast.length != 0 && (
                                                <div className="w-full mt-3">
                                                      <h1 className="text-white text-2xl md:text-center min-[961px]:text-5xl md:text-4xl font-bold font-Stoshi leading-none">Cast</h1>
                                                      <div className="flex mt-2 overflow-x-scroll md:flex-wrap w-full cursor-pointer rounded-3xl  [&::-webkit-scrollbar]:hidden  gap-1 h-40  md:min-h-fit min-[961px]:flex min-[961px]:justify-center min-[961px]:items-center  items-center">{info.castBy.cast.map((eachActor) => <Exclude key={eachActor.cast_id} eachActor={eachActor} />).slice(0, 9)}</div>
                                                </div>
                                          )}
                                          {info.castBy.crew.length != 0 && (
                                                <div className="mt-2 border-b-[0.5px] border-zinc-300/70 pb-5 w-full">
                                                      <h1 className="text-white text-2xl md:text-center md:text-4xl min-[961px]:text-5xl font-bold font-Stoshi leading-none">Crew</h1>
                                                      <div className="flex mt-2 overflow-x-scroll md:flex-wrap w-full cursor-pointer rounded-3xl  [&::-webkit-scrollbar]:hidden  gap-1 h-48 md:min-h-fit min-[961px]:flex min-[961px]:justify-center min-[961px]:items-center items-center">{info.castBy.crew.map((eachActor, index) => <Exclude key={index} eachActor={eachActor} />).slice(0, 9)}</div>
                                                </div>
                                          )}
                                          {info.reviews.length !== 0 && (
                                                <div className="mt-2 border-b-[0.5px] relative border-zinc-300/70 pb-5 w-full">
                                                      <div className="w-full flex justify-between">
                                                            <h1 className="text-white text-2xl  md:text-4xl min-[961px]:text-5xl font-bold font-Stoshi leading-none">Reviews</h1>
                                                            <h1 className="text-white text-xl  md:text-2xl min-[961px]:text-4xl font-bold font-Stoshi leading-none">
                                                                  <span>{info.reviews.length}</span> comments
                                                            </h1>
                                                      </div>
                                                      <div ref={containerRef} className="flex  mt-2 overflow-x-scroll  w-full cursor-pointer   [&::-webkit-scrollbar]:hidden  gap-1 h-48 md:min-h-fit min-[961px]:flex   items-center">
                                                            {/* These are movie List controller  */}
                                                            <div onClick={scrollLeft} className={`absolute z-20 hidden md:block ${isStart ? "cursor-not-allowed opacity-10" : "cursor-auto opacity-100"}  bg-white/30 p-2 backdrop-blur-xl rounded-full right-[25%] top-0`}>
                                                                  <CiCircleChevLeft size="2rem" color="#e5e9de" />
                                                            </div>
                                                            <div onClick={scrollRight} className={`absolute z-20 hidden md:block ${isEnd ? "cursor-not-allowed opacity-10" : "cursor-auto opacity-100"}  bg-white/30 p-2 backdrop-blur-xl rounded-full right-[20%] top-0`}>
                                                                  <CiCircleChevRight size="2rem" color="#e5e9de" />
                                                            </div>
                                                            {info.reviews && info.reviews.map((eachReview) => <Review review={eachReview} key={eachReview.id} />)}
                                                      </div>
                                                </div>
                                          )}

                                          {info.recommendedMovies.length !== 0 && (
                                                <div className="mt-2 overflow-x-hidden mb-20 w-full">
                                                      <h1 className="text-white text-2xl md:text-3xl min-[961px]:text-5xl  md:my-10 font-bold font-Stoshi leading-none">You might also like</h1>
                                                      <div className="flex mt-5 sm:mt-3 overflow-x-scroll md:overflow-x-hidden md:overflow-y-scroll   items-center md:items-start cursor-pointer  [&::-webkit-scrollbar]:hidden  gap-3 sm:h-96 md:grid md:grid-cols-2 lg:grid-cols-3 min-[1250px]:grid-cols-4 md:min-h-fit  h-72">
                                                            {info.recommendedMovies.map((eachMovie, index) => (
                                                                  <Card key={index} type="movie" eachMovie={eachMovie} />
                                                            ))}
                                                      </div>
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
