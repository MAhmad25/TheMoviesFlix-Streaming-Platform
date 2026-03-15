import { useEffect, useState } from "react";
import api from "../../utils/axios";
import Slider from "./Slider";
import AnimatedDropdown from "./DropDown";
const TrendingContainer = () => {
      const [trendingMovie, setTrendingMovie] = useState([]);
      const [query, setQuery] = useState("all");
      useEffect(() => {
            (async () => {
                  try {
                        const { data } = await api.get(`trending/${query}/day`);
                        setTrendingMovie(data.results);
                  } catch (error) {
                        console.log(error.message);
                  }
            })();
      }, [query]);

      return (
            <section className="w-full relative px-5">
                  <div className="flex mb-3 justify-between items-center">
                        <span className="w-full hidden lg:inline border-dotted border-[1px] border-gray-400"></span>
                        <h1 className="sm:text-3xl lg:border-gray-400 lg:border-[1px] lg:px-4 lg:py-2 lg:rounded-3xl  text-nowrap  text-[#fefefe] text-xl">Trending Now</h1>
                        <span className="w-full hidden lg:inline  border-dotted border-[1px] border-gray-400"></span>
                        <AnimatedDropdown
                              items={[
                                    { name: "All Movies and TV", value: "all" },
                                    { name: "TV", value: "tv" },
                                    { name: "Movies", value: "movie" },
                              ]}
                              text="All Movies and TV"
                              onSelect={(value) => setQuery(value)}
                        />
                  </div>
                  <Slider trendingMovie={trendingMovie} />
            </section>
      );
};

export default TrendingContainer;
