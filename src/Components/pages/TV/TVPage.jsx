import { useEffect, useState } from "react";
import { Card, PageSkeleton, CastLoader, AnimatedDropdown } from "../../ui/index";
import api from "../../../utils/axios";
import InfiniteScroll from "react-infinite-scroll-component";
const TVPage = () => {
      document.title = "Trending TV Shows - Watch and Stream Unlimited Movies and TV Series";
      const [trendingTV, setTrendingTV] = useState([]);
      const [page, setPage] = useState(1);
      const [category, setCategory] = useState("airing_today");
      const getCategoryData = async () => {
            try {
                  const { data } = await api.get(`tv/${category}?language=en-US&page=${page}`);
                  setTrendingTV(data.results);
            } catch (error) {
                  console.log(error);
            }
      };
      const getTrendingTV = async () => {
            try {
                  const { data } = await api.get(`trending/tv/day?page=${page}`);
                  setTrendingTV((prevData) => [...prevData, ...data.results]);
                  setPage((prev) => prev + 1);
            } catch (error) {
                  console.log(error);
            }
      };

      useEffect(() => {
            getCategoryData();
      }, [category]);
      useEffect(() => {
            getTrendingTV();
      }, []);
      return (
            <>
                  {trendingTV.length ? (
                        <div className="overflow-x-hidden w-full min-h-dvh pb-28 [background-image:var(--bg-gradient)]">
                              <span className="flex flex-wrap px-5 py-5 gap-4 items-center">
                                    <h1 className="text-2xl tracking-tighter leading-none text-white">Trending TV Shows</h1>
                                    <AnimatedDropdown
                                          items={[
                                                { name: "On the Air", value: "on_the_air" },
                                                { name: "Popular Today", value: "airing_today" },
                                                { name: "Popular", value: "popular" },
                                          ]}
                                          text="Popular Today"
                                          onSelect={(value) => setCategory(value)}
                                    />
                              </span>
                              <InfiniteScroll hasMore={true} next={getTrendingTV} loader={<CastLoader />} dataLength={trendingTV.length}>
                                    <div className="media-grid px-3 w-full gap-3 md:gap-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">{trendingTV && trendingTV.map((eachTV, index) => <Card type="tv" key={index} eachMovie={eachTV} />)}</div>
                              </InfiniteScroll>
                        </div>
                  ) : (
                        <PageSkeleton />
                  )}
            </>
      );
};

export default TVPage;
