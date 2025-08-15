import { useEffect, useState } from "react";
import { Card, PageSkeleton } from "../../ui/index";
import api from "../../../utils/axios";
import InfiniteScroll from "react-infinite-scroll-component";
const TVPage = () => {
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
                        <div className="bg-[rgb(31,71,69)]  overflow-x-hidden w-full h-full bg-[linear-gradient(27deg,_rgba(31,71,69,1)_10%,_rgba(16,36,27,1)_67%,_rgba(68,73,53,1)_100%)]">
                              <span className="flex px-5 py-5 gap-4 items-center">
                                    <h1 className="text-2xl tracking-tighter leading-none text-white">Trending TV Shows</h1>
                                    <select onChange={(e) => setCategory(e.target.value)} className="outline-none bg-transparent  text-[#A5DBC9] border-[0.5px] rounded-xl text-xs px-3 py-1" name="category" id="category">
                                          <option className="text-green-900" defaultValue="airing_today" value="airing_today">
                                                Popular Today
                                          </option>
                                          <option className="text-green-900" value="on_the_air">
                                                On the Air
                                          </option>
                                          <option className=" text-green-900 " value="popular">
                                                Popular
                                          </option>
                                    </select>
                              </span>
                              <InfiniteScroll hasMore={true} next={getTrendingTV} loader={<PageSkeleton />} dataLength={trendingTV.length}>
                                    <div className=" px-2 gap-x-6 overflow-x-hidden gap-y-4 grid sm:grid-cols-3 grid-cols-2 ">{trendingTV && trendingTV.map((eachTV, index) => <Card type="tv" key={index} eachMovie={eachTV} />)}</div>
                              </InfiniteScroll>
                        </div>
                  ) : (
                        <PageSkeleton />
                  )}
            </>
      );
};

export default TVPage;
