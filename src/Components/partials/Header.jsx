/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import ImageLoader from "./ImageLoader";

const Header = () => {
      const [nowPlaying, setNowPlaying] = useState([]);
      const [movieIndex, setMovieIndex] = useState(1);
      const [showSkeleton, setSkeleton] = useState(true);
      const getTrendingData = async () => {
            try {
                  const { data } = await api.get("/movie/now_playing");
                  setNowPlaying(data.results[movieIndex]);
            } catch (error) {
                  console.log(error);
            }
      };

      useEffect(() => {
            const changeMovieIndex = setInterval(() => {
                  setMovieIndex((prev) => (prev + 1) % 20);
            }, 10000);
            getTrendingData();
            return () => clearInterval(changeMovieIndex);
      }, [movieIndex]);
      return (
            <header className="w-full p-5 leading-none font-Stoshi">
                  <section className="overflow-hidden">
                        <h1 className="text-2xl md:text-3xl tracking-tighter text-[#c7a931]">MoviesFlix</h1>
                        <h4 className="text-white/70">Made By Ahmad</h4>
                  </section>
                  <section className="w-full h-[35vh] sm:h-[60vh] lg:h-[90vh] relative mt-3 overflow-hidden rounded-md">
                        {showSkeleton ? (
                              <ImageLoader />
                        ) : (
                              <div className="bottom-0  px-4 text-white  py-3 left-0 bg-gradient-to-t from-zinc-600/70 to-transparent sm:bg-gradient-to-t sm:from-zinc-800/30 sm:to-zinc-500/10 lg:bg-gradient-to-t lg:from-zinc-800/50 lg:to-zinc-300/10 md:bg-gradient-to-t md:from-zinc-700/40  md:to-transparent  overflow-hidden lg:backdrop-blur-md sm:backdrop-blur-sm  sm:w-1/2 md:h-[55%] lg:h-fit w-full h-[50%] absolute">
                                    <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl min-[1150px]:text-5xl  tracking-tighter leading-none">{(nowPlaying.original_title && nowPlaying.original_title.slice(0, 20)) || nowPlaying.title}</h1>
                                    {nowPlaying.overview && (
                                          <p className="text-xs sm:mt-1 sm:text-sm md:text-lg lg:text-xl mt-2 text-zinc-white sm:text-white md:text-zinc-200 lg:text-zinc-100 tracking-tighter leading-none">
                                                {nowPlaying.overview && nowPlaying.overview.slice(0, 130)}...
                                                <Link className="text-blue-300 lg:text-yellow-300" to={`/movie/details/${nowPlaying.id}`}>
                                                      see more
                                                </Link>
                                          </p>
                                    )}
                                    <div className="flex items-center mt-2 gap-2">
                                          {nowPlaying.vote_average != 0 && <h4 className="backdrop-blur px-3 bg-transparent py-1 rounded-full md:text-sm lg:text-lg w-fit text-xs">⭐Rating: {nowPlaying.vote_average && nowPlaying.vote_average.toFixed(1)}/10</h4>}
                                          <h4 className="backdrop-blur px-2  py-1 rounded-full  w-fit md:text-sm lg:text-lg text-xs">{nowPlaying.release_date && nowPlaying.release_date.split("-")[0]}</h4>
                                    </div>
                              </div>
                        )}
                        <img onLoad={() => setSkeleton(false)} className="w-full h-full object-cover  object-top" loading="lazy" src={`https://image.tmdb.org/t/p/original${nowPlaying.poster_path || nowPlaying.backdrop_path}`} alt="" />
                  </section>
            </header>
      );
};

export default Header;
