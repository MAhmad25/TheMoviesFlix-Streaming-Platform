import { useEffect, useState } from "react";
import { Carousel, createTheme, ThemeProvider } from "flowbite-react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { ImageLoader } from "./index";

const Header = () => {
      const [nowPlaying, setNowPlaying] = useState([]);
      const [showSkeleton, setSkeleton] = useState(true);
      const getTrendingData = async () => {
            try {
                  const { data } = await api.get("/movie/now_playing");
                  setNowPlaying(data.results);
            } catch (error) {
                  console.log(error);
            }
      };

      useEffect(() => {
            getTrendingData();
      }, []);

      const customTheme = createTheme({
            carousel: {
                  control: {
                        base: "inline-flex items-center justify-center scale-75 md:scale-100 rounded-full dark:bg-white dark:text-black bg-black text-white",
                        icon: "rounded-full  bg-black dark:bg-white dark:text-black text-white",
                  },
                  indicators: {
                        base: "h-3 w-3 rounded-full  hidden ",
                  },
            },
      });

      return (
            <header className="w-full p-5 leading-none font-Stoshi">
                  <section className="overflow-hidden flex gap-4 items-center">
                        <img src="/logo.svg" alt="Logo" />
                        <h1 className="text-2xl md:text-3xl tracking-tighter text-[#c7a931]">MoviesFlix</h1>
                  </section>
                  <section className="w-full h-[35vh] sm:h-[60vh] lg:h-[90vh]  flex relative mt-3 overflow-hidden rounded-md">
                        <ThemeProvider theme={customTheme}>
                              <Carousel>
                                    {nowPlaying.map((eachMovieCard, index) => (
                                          <div key={index} className="w-full relative shrink-0 h-full">
                                                {showSkeleton ? (
                                                      <ImageLoader />
                                                ) : (
                                                      <div className="bottom-0  px-4 text-white  py-3 left-0 bg-gradient-to-t from-zinc-600/70 to-transparent sm:bg-gradient-to-t sm:from-zinc-800/30 sm:to-zinc-500/10 lg:bg-gradient-to-t lg:from-zinc-800/50 lg:to-zinc-300/10 md:bg-gradient-to-t md:from-zinc-700/40  md:to-transparent  overflow-hidden lg:backdrop-blur-lg sm:backdrop-blur-sm  sm:w-1/2 md:h-[55%] lg:h-fit w-full h-[50%] absolute">
                                                            <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl min-[1150px]:text-5xl  tracking-tighter leading-none">{(eachMovieCard.original_title && eachMovieCard.original_title.slice(0, 20)) || eachMovieCard.title}</h1>
                                                            {eachMovieCard.overview && (
                                                                  <p className="text-xs sm:mt-1 sm:text-sm md:text-lg lg:text-xl mt-2 text-zinc-white sm:text-white md:text-zinc-200 lg:text-zinc-100 tracking-tighter leading-none">
                                                                        {eachMovieCard.overview && eachMovieCard.overview.slice(0, 130)}...
                                                                        <Link className="text-blue-300 lg:text-yellow-300" to={`/movie/details/${eachMovieCard.id}`}>
                                                                              see full detail
                                                                        </Link>
                                                                  </p>
                                                            )}
                                                            <div className="flex items-center mt-2 gap-2">
                                                                  {eachMovieCard.vote_average != 0 && <h4 className="backdrop-blur px-3 bg-transparent py-1 rounded-full md:text-sm lg:text-lg w-fit text-xs">⭐Rating: {eachMovieCard.vote_average && eachMovieCard.vote_average.toFixed(1)}/10</h4>}
                                                                  <h4 className="backdrop-blur px-2  py-1 rounded-full  w-fit md:text-sm lg:text-lg text-xs">{eachMovieCard.release_date && eachMovieCard.release_date.split("-")[0]}</h4>
                                                            </div>
                                                      </div>
                                                )}
                                                <img onLoad={() => setSkeleton(false)} className="w-full h-full object-cover  object-top" src={`https://image.tmdb.org/t/p/original${eachMovieCard.backdrop_path || eachMovieCard.poster_path}`} alt="Poster" />
                                          </div>
                                    ))}
                              </Carousel>
                        </ThemeProvider>
                  </section>
            </header>
      );
};

export default Header;
