import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncTvLoader, removeTv } from "../../store/actions/tvAction";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { MdOutlinePlayCircle } from "react-icons/md";
import Loader from "../partials/Loader";
import { IoChevronBackOutline } from "react-icons/io5";
import Exclude from "./Exclude";
import style from "../../styles/TrendingContainer.module.css";
import Card from "../partials/Card";
import SeasonCard from "./SeasonCard";
const TvDetails = () => {
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const info = useSelector((state) => state.tv.info);
      const { id } = useParams();
      useEffect(() => {
            dispatch(asyncTvLoader(id));
            return () => dispatch(removeTv());
      }, [id, dispatch]);
      console.log(info);
      return (
            <>
                  {info ? (
                        <section className="w-dvw relative overflow-x-hidden  bg-bottom " style={{ backgroundImage: info.detail.backdrop_path ? `url(https://image.tmdb.org/t/p/original${info.detail.backdrop_path})` : `/icon.png` }}>
                              <span onClick={() => navigate(-1)} className="absolute z-10 bg-white/30 backdrop-blur rounded-full p-2 top-5 left-5">
                                    <IoChevronBackOutline size="1.5rem" color="black" />
                              </span>
                              <section className="backdrop-blur-2xl overflow-x-hidden  w-full min-h-full max-h-[250dvh] bg-black/30">
                                    <div className="w-full  overflow-hidden rounded-b-2xl">
                                          <img className="w-full h-full object-top object-cover" src={info.detail.backdrop_path ? `https://image.tmdb.org/t/p/original${info.detail.backdrop_path}` : `/noImage.jpg`} alt="" />
                                    </div>
                                    <section className="px-5 overflow-x-hidden text-white  mt-3 w-full font-Stoshi">
                                          <h1 className="tracking-tight leading-none text-3xl  font-black">{info.detail.name || info.detail.original_name}</h1>
                                          <h3 className="text-white/70 mt-2 text-lg tracking-tight leading-none">{info.detail.tagline || info.detail.status}</h3>
                                          <div className="flex mt-3 flex-wrap gap-1 w-full">
                                                <h2 className="px-3 py-1 shrink-0 bg-white/10 text-sm text-zinc-300 rounded-full overflow-hidden flex justify-center items-center backdrop-blur-sm">Total Seasons: {info.detail.number_of_seasons}</h2>
                                                {info.detail.genres.map((genre) => (
                                                      <h2 key={genre.id} className="px-3 shrink-0 tracking-tighter leading-none py-1 bg-white/10 text-sm text-zinc-300 rounded-full overflow-hidden flex justify-center items-center backdrop-blur-sm">
                                                            {genre.name}
                                                      </h2>
                                                ))}
                                          </div>
                                          <div className="w-full  mt-3 flex justify-between items-center">
                                                <h1 className="text-white text-lg font-medium">
                                                      ⭐{info.detail.vote_average.toFixed(0)}/10 <span className="text-zinc-300 font-normal text-xs">{info.detail.vote_count} votes</span>
                                                </h1>
                                                <Link to="trailer" className="flex gap-1  items-center justify-center">
                                                      <MdOutlinePlayCircle size="2rem" />
                                                      <p className="text-lg tracking-tight leading-none">Watch Trailer</p>
                                                </Link>
                                          </div>
                                          <div className="w-full text-white font-Stoshi mt-3 border-t-[.5px] border-zinc-300/70 py-3">
                                                <div className="flex w-full gap-2 items-center">
                                                      <h1 className="text-2xl  font-semibold">About the Tv Show</h1>
                                                      <span className="bg-yellow-500/60 text-white backdrop-blur-sm px-3 text-xs py-1 rounded-full">{info.detail.first_air_date ? info.detail.first_air_date.split("-")[0] : info.detail.last_air_date ? info.detail.last_air_date.split("-")[0] : "Not Released"}</span>
                                                </div>
                                                <p className="tracking-tighter text-zinc-300 leading-5">{info.detail.overview}</p>
                                          </div>
                                          {info.detail.seasons.length != 0 && (
                                                <div className="w-full">
                                                      <h1 className="text-white text-2xl font-bold font-Stoshi leading-none">Tv Season</h1>
                                                      <div className={`flex mt-4  items-center overflow-x-scroll w-full cursor-pointer   ${style.scrollbar}  gap-3 h-64`}>
                                                            {info.detail.seasons.map((eachSeason, index) => (
                                                                  <SeasonCard key={index} eachSeason={eachSeason} />
                                                            ))}
                                                      </div>
                                                </div>
                                          )}
                                          {info.castBy.cast.length != 0 && (
                                                <div className="w-full">
                                                      <h1 className="text-white text-2xl font-bold font-Stoshi leading-none">Cast</h1>
                                                      <div className={`flex mt-2 overflow-x-scroll w-full cursor-pointer rounded-3xl  ${style.scrollbar}  gap-1 h-40 items-center`}>{info.castBy.cast.map((eachActor, index) => <Exclude key={index} eachActor={eachActor} />).slice(0, 9)}</div>
                                                </div>
                                          )}
                                          {info.castBy.crew.length != 0 && (
                                                <div className="mt-2 border-b-[0.5px] border-zinc-300/70 pb-5 w-full">
                                                      <h1 className="text-white text-2xl font-bold font-Stoshi leading-none">Crew</h1>
                                                      <div className={`flex mt-2 overflow-x-scroll w-full cursor-pointer rounded-3xl  ${style.scrollbar}  gap-1 h-48 items-center`}>{info.castBy.crew.map((eachActor, index) => <Exclude key={index} eachActor={eachActor} />).slice(0, 9)}</div>
                                                </div>
                                          )}
                                          {/* Recommend TV List */}
                                          {info.recommendedTv.length != 0 && (
                                                <div className="mt-6 mb-20 w-full">
                                                      <h1 className="text-white text-2xl font-bold font-Stoshi leading-none">Recommended</h1>
                                                      <div className={`flex mt-5 overflow-x-scroll w-full items-center cursor-pointer   ${style.scrollbar}  gap-3 h-72 `}>
                                                            {info.recommendedTv.map((eachTv, index) => (
                                                                  <Card key={index} type="tv" eachMovie={eachTv} />
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

export default TvDetails;
