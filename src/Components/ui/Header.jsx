import { useEffect, useState } from "react";
import { Carousel, createTheme, ThemeProvider } from "flowbite-react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { ImageLoader } from "./index";
import { motion } from "motion/react";

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
                        base: "inline-flex items-center justify-center scale-75 mb-10 md:scale-100 rounded-full dark:bg-white dark:text-black bg-black text-white",
                        icon: "rounded-full  bg-black dark:bg-white dark:text-black text-white",
                  },
                  indicators: {
                        base: "h-3 w-3 rounded-full  hidden ",
                  },
            },
      });
      const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                  opacity: 1,
                  transition: {
                        staggerChildren: 0.2,
                        delayChildren: 0.2,
                  },
            },
      };

      const childVariants = {
            hidden: {
                  opacity: 0,
                  y: 20,
            },
            visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                        duration: 0.5,
                        ease: "easeOut",
                  },
            },
      };

      return (
            <header className="w-full p-5 leading-none font-Stoshi">
                  <section className="w-full h-[35vh] sm:h-[60vh] lg:h-[90vh]  flex relative mt-3 overflow-hidden rounded-md">
                        <ThemeProvider theme={customTheme}>
                              <Carousel>
                                    {nowPlaying.map((eachMovieCard, index) => (
                                          <div key={index} className="w-full relative shrink-0 h-full">
                                                {showSkeleton ? (
                                                      <ImageLoader />
                                                ) : (
                                                      <div className="bottom-0 bg-gradient px-4 text-white  py-2 left-0  overflow-hidden  md:h-[55%] lg:h-fit w-full h-[50%] absolute">
                                                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full h-full bg-transparent">
                                                                  <motion.h1 variants={childVariants} className="text-xl font-semibold sm:text-2xl  md:text-3xl lg:text-4xl min-[1150px]:text-5xl leading-none">
                                                                        {(eachMovieCard.original_title && eachMovieCard.original_title) || eachMovieCard.title}
                                                                  </motion.h1>
                                                                  {eachMovieCard.overview && (
                                                                        <motion.p variants={childVariants} className="text-xs sm:mt-1 sm:text-sm md:text-lg lg:text-xl mt-2 text-zinc-white  md:w-3/4 sm:text-white md:text-zinc-200 lg:text-zinc-100 tracking-tight leading-none">
                                                                              {eachMovieCard.overview && eachMovieCard.overview.slice(0, 250)}...
                                                                              <Link className="text-blue-300 lg:text-yellow-300" to={`/movie/details/${eachMovieCard.id}`}>
                                                                                    see full detail
                                                                              </Link>
                                                                        </motion.p>
                                                                  )}
                                                                  <motion.div variants={childVariants} className="flex items-center mt-2 gap-2">
                                                                        {eachMovieCard.vote_average != 0 && <h4 className="backdrop-blur px-3 bg-transparent py-1 rounded-full md:text-sm lg:text-lg w-fit text-xs">⭐Rating: {eachMovieCard.vote_average && eachMovieCard.vote_average.toFixed(1)}/10</h4>}
                                                                        <motion.h4 variants={childVariants} className="backdrop-blur px-2  py-1 rounded-full  w-fit md:text-sm lg:text-lg text-xs">
                                                                              {eachMovieCard.release_date && eachMovieCard.release_date.split("-")[0]}
                                                                        </motion.h4>
                                                                  </motion.div>
                                                            </motion.div>
                                                      </div>
                                                )}
                                                <img onLoad={() => setSkeleton(false)} className="w-full h-full object-cover  object-top" src={`https://image.tmdb.org/t/p/original${eachMovieCard.backdrop_path || eachMovieCard.poster_path}`} alt={eachMovieCard.backdrop_path || eachMovieCard.poster_path} />
                                          </div>
                                    ))}
                              </Carousel>
                        </ThemeProvider>
                  </section>
            </header>
      );
};

export default Header;
