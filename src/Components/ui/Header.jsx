import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { StarIcon } from "./index";
import { Carousel, Slider, SliderContainer } from "./Carousal";
import Autoplay from "embla-carousel-autoplay";
import { play } from "cuelume";
import GlisseSurface from "./GlisseSurface";
import { Clapperboard, Play } from "lucide-react";

const Header = () => {
      const [nowPlaying, setNowPlaying] = useState([]);
      useEffect(() => {
            (async () => {
                  try {
                        const { data } = await api.get("trending/all/day");
                        setNowPlaying(data.results);
                  } catch (error) {
                        console.log(error.message);
                  }
            })();
      }, []);

      const OPTIONS = { loop: true };

      return (
            <header className="w-full leading-none font-primary">
                  <section className="w-full flex relative">
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
                                                <div className="home-hero-slide">
                                                      <div className="hero-artwork" data-glisse-backdrop>
                                                            <img loading="eager" className="home-hero-image" src={eachMovieCard.backdrop_path || eachMovieCard.poster_path ? `https://image.tmdb.org/t/p/w780${eachMovieCard.backdrop_path || eachMovieCard.poster_path}` : "/noImage.jpg"} alt="" />
                                                      </div>
                                                      <div className="home-hero-content px-4 text-white">
                                                            <div className="w-full space-y-5 bg-transparent">
                                                                  <h1 className="text-3xl break-words h-fit font-semibold font-astralga lg:text-4xl min-[1150px]:text-5xl leading-none">{eachMovieCard?.original_title || eachMovieCard?.title || eachMovieCard?.name}</h1>
                                                                  <div className="hero-media-actions" aria-label={`Watch or view trailer for ${eachMovieCard?.original_title || eachMovieCard?.title || eachMovieCard?.name}`}>
                                                                        <GlisseSurface className="hero-media-action hero-media-action--primary">
                                                                              <Link onClick={() => play("press")} to={`/${eachMovieCard.media_type === "tv" ? "tv" : "movie"}/details/${eachMovieCard?.id}/${eachMovieCard.media_type === "tv" ? "watch/1/1" : "watch"}`}>
                                                                                    <Play size={18} fill="#ff7949" aria-hidden="true" /> Watch
                                                                              </Link>
                                                                        </GlisseSurface>
                                                                        <GlisseSurface className="hero-media-action">
                                                                              <Link onClick={() => play("press")} to={`/${eachMovieCard.media_type === "tv" ? "tv" : "movie"}/details/${eachMovieCard?.id}/trailer`}>
                                                                                    <Clapperboard size={18} aria-hidden="true" /> Trailer
                                                                              </Link>
                                                                        </GlisseSurface>
                                                                  </div>
                                                                  <div className="flex flex-wrap items-center mt-2 gap-2">
                                                                        {eachMovieCard.vote_average != 0 && (
                                                                              <GlisseSurface className="hero-meta-pill px-3 py-1 rounded-full w-fit">
                                                                                    <h4 className="m-0 flex items-center gap-1 text-lg font-bold text-yellow-300">
                                                                                          <StarIcon color="yellow" />
                                                                                          <span>Rating: {eachMovieCard.vote_average.toFixed(1)}/10</span>
                                                                                    </h4>
                                                                              </GlisseSurface>
                                                                        )}
                                                                        {(eachMovieCard?.release_date || eachMovieCard?.first_air_date) && <GlisseSurface className="hero-meta-pill font-bold text-yellow-300 px-2 py-1 rounded-full w-fit text-lg">{eachMovieCard?.release_date?.split("-")[0] || eachMovieCard?.first_air_date?.split("-")[0]}</GlisseSurface>}
                                                                        {eachMovieCard?.media_type && <GlisseSurface className="hero-meta-pill text-lg font-bold px-3 py-1 rounded-full text-yellow-300">{eachMovieCard?.media_type?.toUpperCase()}</GlisseSurface>}
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </div>
                                          </Slider>
                                    ))}
                              </SliderContainer>
                        </Carousel>
                  </section>
            </header>
      );
};

export default Header;
