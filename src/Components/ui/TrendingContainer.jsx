import { useEffect, useState } from "react";
import api from "../../utils/axios";
import Slider from "./Slider";
const TrendingContainer = () => {
      const [trendingMovie, setTrendingMovie] = useState([]);
      const [query, setQuery] = useState("all");
      useEffect(() => {
            (async () => {
                  try {
                        const { data } = await api.get(`trending/${query}/day`);
                        setTrendingMovie(data.results);
                  } catch (error) {
                        console.log(error);
                  }
            })();
      }, [query]);

      return (
            <section className="w-full  relative px-5">
                  <div className="flex mb-3 justify-between items-center">
                        <span className="w-full hidden lg:inline border-dotted border-[1px] border-gray-400"></span>
                        <h1 className="sm:text-3xl  text-nowrap  text-[#fefefe] text-xl">Trending Now</h1>
                        <span className="w-full hidden lg:inline  border-dotted border-[1px] border-gray-400"></span>
                        <select onChange={(e) => setQuery(e.target.value)} className="outline-none  text-black bg-[#fefefe] border-[0.5px] rounded-xl text-xs sm:text-lg px-3 py-1" name="TV shows and Movies" id="TV_shows_and_Movies_category">
                              <option aria-label="all movies and tv" defaultValue="all" value="all">
                                    All Movies and TV
                              </option>
                              <option aria-label="tv" value="tv">
                                    TV
                              </option>
                              <option aria-label="movies" value="movie">
                                    Movies
                              </option>
                        </select>
                  </div>
                  <Slider trendingMovie={trendingMovie} />
            </section>
      );
};

export default TrendingContainer;
