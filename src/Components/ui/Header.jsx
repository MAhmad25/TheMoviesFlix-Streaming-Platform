import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { ImageLoader } from "./index";
import { Carousel, Slider, SliderContainer, SliderDotButton } from "./Carousal";
import Autoplay from "embla-carousel-autoplay";

const Header = () => {
      const [nowPlaying, setNowPlaying] = useState([]);
      const [showSkeleton, setSkeleton] = useState(true);

      useEffect(() => {
            (async () => {
                  try {
                        const { data } = await api.get("/movie/now_playing");
                        setNowPlaying(data.results);
                  } catch (error) {
                        console.log(error);
                  }
            })();
      }, []);

      const OPTIONS = { loop: true };

      return (
            <header className="w-full p-5 leading-none font-primary">
                  <section className="w-full h-[35vh] sm:h-[60vh] lg:h-[90vh] flex relative mt-3 overflow-hidden rounded-md">
                        <Carousel
                              options={OPTIONS}
                              className="w-full"
                              plugins={[
                                    Autoplay({
                                          playOnInit: true,
                                          delay: 4000,
                                          stopOnMouseEnter: false,
                                          stopOnInteraction: false,
                                    }),
                              ]}
                        >
                              <SliderContainer className="gap-0 cursor-grab">
                                    {nowPlaying.map((eachMovieCard, index) => (
                                          <Slider key={index} className="w-full">
                                                <div className="w-full relative h-[35vh] sm:h-[60vh] lg:h-[90vh]">
                                                      {showSkeleton && <ImageLoader />}

                                                      <div className="bottom-0 bg-gradient px-4 text-white py-2 left-0 flex items-end overflow-hidden lg:inset-0 lg:h-full w-full h-[50%] absolute z-10">
                                                            <div className="w-full bg-transparent">
                                                                  <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl min-[1150px]:text-5xl leading-none">{eachMovieCard.original_title || eachMovieCard.title}</h1>
                                                                  {eachMovieCard.overview && (
                                                                        <p className="text-xs sm:mt-1 sm:text-sm md:text-lg lg:text-xl mt-2 text-zinc-white md:w-3/4 sm:text-white md:text-zinc-200 lg:text-zinc-100 tracking-tight leading-none">
                                                                              {eachMovieCard.overview.slice(0, 250)}...
                                                                              <Link className="text-blue-300 lg:text-yellow-300 ml-1" to={`/movie/details/${eachMovieCard.id}`}>
                                                                                    see full detail
                                                                              </Link>
                                                                        </p>
                                                                  )}
                                                                  <div className="flex items-center mt-2 gap-2">
                                                                        {eachMovieCard.vote_average != 0 && <h4 className="backdrop-blur px-3 bg-transparent py-1 rounded-full md:text-sm lg:text-lg w-fit text-xs">⭐Rating: {eachMovieCard.vote_average.toFixed(1)}/10</h4>}
                                                                        <h4 className="backdrop-blur px-2 py-1 rounded-full w-fit md:text-sm lg:text-lg text-xs">{eachMovieCard.release_date?.split("-")[0]}</h4>
                                                                  </div>
                                                            </div>
                                                      </div>

                                                      <img onLoad={() => setSkeleton(false)} className="w-full h-full object-cover object-top" src={`https://image.tmdb.org/t/p/original${eachMovieCard.backdrop_path || eachMovieCard.poster_path}`} alt={eachMovieCard.original_title || eachMovieCard.title} />
                                                </div>
                                          </Slider>
                                    ))}
                              </SliderContainer>

                              <div className="lg:flex hidden lg:justify-center py-4 lg:absolute lg:bottom-0 lg:left-1/2 transform -translate-x-1/2 z-20">
                                    <SliderDotButton />
                              </div>
                        </Carousel>
                  </section>
            </header>
      );
};

export default Header;
