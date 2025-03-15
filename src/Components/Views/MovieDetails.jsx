import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncMovieLoader, removeMovie } from "../../store/actions/movieAction";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { MdOutlinePlayCircle } from "react-icons/md";
import Loader from "../partials/Loader";
import { IoChevronBackOutline } from "react-icons/io5";
import Exclude from "./Exclude";
import style from "../../styles/TrendingContainer.module.css";
import Card from "../partials/Card";
const MovieDetails = () => {
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const info = useSelector((state) => state.movie.info);
      const { id } = useParams();
      useEffect(() => {
            dispatch(asyncMovieLoader(id));
            return () => dispatch(removeMovie());
      }, [id, dispatch]);
      return (
            <>
                  {info ? (
                        <section className="w-full relative overflow-x-hidden  bg-bottom " style={{ backgroundImage: info.detail.backdrop_path || info.detail.poster_path ? `url(https://image.tmdb.org/t/p/original${info.detail.backdrop_path || info.detail.poster_path})` : `/icon.png` }}>
                              <span onClick={() => navigate(-1)} className="absolute z-10 bg-white/30 backdrop-blur rounded-full p-2 top-5 left-5">
                                    <IoChevronBackOutline size="1.5rem" color="black" />
                              </span>
                              <section className="backdrop-blur-2xl overflow-x-hidden relative overflow-hidden w-full  min-h-[250dvh] sm:min-h-[300dvh] md:min-h-[322dvh] bg-black/30">
                                    <div className="w-full max-h-96  overflow-hidden rounded-b-2xl">
                                          <img className="w-full h-full object-top object-cover" src={info.detail.backdrop_path || info.detail.poster_path ? `https://image.tmdb.org/t/p/original${info.detail.backdrop_path || info.detail.poster_path}` : `/noImage.jpg`} alt="" />
                                    </div>
                                    <section className="px-5 overflow-x-hidden text-white  mt-3 w-full font-Stoshi">
                                          <div className="md:absolute md:bg-gradient-to-t md:from-zinc-700/40  md:to-transparent md:w-full md:left-0 md:backdrop-blur-[2px] md:px-5 md:py-5 md:top-[10.55rem] lg:top-[10.1rem]">
                                                <h1 className="tracking-tight leading-none md:text-4xl lg:text-5xl  text-3xl  font-black">{info.detail.title || info.detail.original_title}</h1>
                                                <h3 className="text-white/70 md:text-white mt-2 text-lg md:text-lg tracking-tight leading-none">{info.detail.tagline || info.detail.status}</h3>
                                                <div className="flex mt-3 flex-wrap gap-1 w-full">
                                                      {info.detail.runtime && (
                                                            <h2 className="px-3 py-1 shrink-0 bg-white/10 text-sm md:text-lg text-zinc-300 md:text-white rounded-full overflow-hidden flex justify-center items-center backdrop-blur-sm">
                                                                  {Math.floor(info.detail.runtime / 60)}h {(info.detail.runtime % 60).toFixed(0)}min
                                                            </h2>
                                                      )}
                                                      {info.detail.genres.map((genre) => (
                                                            <h2 key={genre.id} className="px-3 shrink-0 tracking-tighter leading-none py-1 bg-white/10 text-sm md:text-lg text-zinc-300 md:text-white rounded-full overflow-hidden flex justify-center items-center backdrop-blur-sm">
                                                                  {genre.name}
                                                            </h2>
                                                      ))}
                                                </div>
                                                <div className="w-full  mt-3 flex justify-between md:justify-start md:gap-5 items-center">
                                                      <h1 className="text-white text-lg md:text-xl font-medium">
                                                            ⭐{info.detail.vote_average.toFixed(0)}/10 <span className="text-zinc-300 md:text-white md:text-sm font-normal text-xs">{info.detail.vote_count} votes</span>
                                                      </h1>
                                                      <Link to="trailer" className="flex gap-1  items-center justify-center">
                                                            <MdOutlinePlayCircle size="2.4rem" />
                                                            <p className="text-lg md:text-2xl tracking-tight leading-none">Watch Trailer</p>
                                                      </Link>
                                                </div>
                                          </div>
                                          <div className="w-full text-white min-[961px]:flex min-[961px]:flex-col min-[961px]:justify-center min-[961px]:items-center font-Stoshi mt-3 border-t-[.5px] md:border-none border-zinc-300/70 py-3">
                                                <div className="flex w-full gap-2  md:justify-center items-center">
                                                      <h1 className="text-2xl min-[961px]:text-5xl min-[961px]:underline md:text-3xl md:mb-3  font-semibold">About the movie</h1>
                                                      <span className="bg-yellow-500/60 text-white backdrop-blur-sm px-3 md:text-lg text-xs py-1 rounded-full">{info.detail.release_date.split("-")[0]}</span>
                                                </div>
                                                <p className="tracking-tighter min-[961px]:text-2xl min-[961px]:w-1/2 md:text-xl text-zinc-300 leading-5">{info.detail.overview}</p>
                                          </div>

                                          {info.castBy.cast.length != 0 && (
                                                <div className="w-full mt-3">
                                                      <h1 className="text-white text-2xl md:text-center min-[961px]:text-5xl md:text-4xl font-bold font-Stoshi leading-none">Cast</h1>
                                                      <div className={`flex mt-2 overflow-x-scroll md:flex-wrap w-full cursor-pointer rounded-3xl  ${style.scrollbar}  gap-1 h-40  md:min-h-fit min-[961px]:flex min-[961px]:justify-center min-[961px]:items-center  items-center`}>{info.castBy.cast.map((eachActor) => <Exclude key={eachActor.cast_id} eachActor={eachActor} />).slice(0, 9)}</div>
                                                </div>
                                          )}
                                          {info.castBy.crew.length != 0 && (
                                                <div className="mt-2 border-b-[0.5px] border-zinc-300/70 pb-5 w-full">
                                                      <h1 className="text-white text-2xl md:text-center md:text-4xl min-[961px]:text-5xl font-bold font-Stoshi leading-none">Crew</h1>
                                                      <div className={`flex mt-2 overflow-x-scroll md:flex-wrap w-full cursor-pointer rounded-3xl  ${style.scrollbar}  gap-1 h-48 md:min-h-fit min-[961px]:flex min-[961px]:justify-center min-[961px]:items-center items-center`}>{info.castBy.crew.map((eachActor, index) => <Exclude key={index} eachActor={eachActor} />).slice(0, 9)}</div>
                                                </div>
                                          )}

                                          {info.recommendedMovies.length !== 0 && (
                                                <div className="mt-2 overflow-x-hidden mb-20 w-full">
                                                      <h1 className="text-white text-2xl md:text-3xl min-[961px]:text-5xl md:underline md:my-10 font-bold font-Stoshi leading-none">Similar Movies</h1>
                                                      <div className={`flex mt-5 sm:mt-3 overflow-x-scroll md:overflow-x-hidden md:overflow-y-scroll  min-w-[100vw] items-center md:items-start cursor-pointer  ${style.scrollbar}  gap-3 sm:h-96 md:grid md:grid-cols-2 lg:grid-cols-3 min-[1250px]:grid-cols-4 md:min-h-fit h-72 `}>
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
                        <Loader />
                  )}
            </>
      );
};

export default MovieDetails;
