import { useEffect, useState } from "react";
import api from "../../utils/axios";
import Slider from "./Slider";
import AnimatedDropdown from "./DropDown";
import GlisseSurface from "./GlisseSurface";
const TrendingContainer = () => {
      const [trendingMovie, setTrendingMovie] = useState([]);
      const [query, setQuery] = useState("tv");
      useEffect(() => {
            const controller = new AbortController();
            (async () => {
                  try {
                        const { data } = await api.get(`trending/${query}/day`, { signal: controller.signal });
                        setTrendingMovie(data.results);
                  } catch (error) {
                        if (!controller.signal.aborted) console.log(error.message);
                  }
            })();
            return () => controller.abort();
      }, [query]);

      return (
            <section className="w-full relative px-5">
                  <div className="trending-container-heading flex flex-wrap lg:flex-nowrap gap-3 mb-3 justify-between items-center">
                        <span className="flex-1 hidden lg:inline border-dotted border-[1px] border-gray-400"></span>
                        <GlisseSurface className="glass-section-heading"><h1 className="sm:text-3xl text-nowrap text-[#fefefe] text-xl">Trending Now</h1></GlisseSurface>
                        <span className="flex-1 hidden lg:inline border-dotted border-[1px] border-gray-400"></span>
                        <AnimatedDropdown
                              items={[
                                    { name: "Movies", value: "movie" },
                                    { name: "TV Series", value: "tv" },
                              ]}
                              value={query}
                              className="trending-media-toggle"
                              label="Trending media type"
                              onSelect={(value) => setQuery(value)}
                        />
                  </div>
                  <Slider trendingMovie={trendingMovie} />
            </section>
      );
};

export default TrendingContainer;
