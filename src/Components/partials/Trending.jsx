/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Card from "./Card";
import api from "../../utils/axios";
import { MdOutlineHorizontalRule } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import PageSkeleton from "./Loaders/PageLoader";

const Trending = () => {
      const [trendingMovie, setTrendingMovie] = useState([]);
      const [page, setPage] = useState(1);
      const getTrendingData = async () => {
            try {
                  const { data } = await api.get(`trending/movie/day?page=${page}`);
                  setTrendingMovie((prevData) => [...prevData, ...data.results]);
                  setPage((prev) => prev + 1);
            } catch (error) {
                  console.log(error);
            }
      };

      useEffect(() => {
            getTrendingData();
      }, []);
      return (
            <>
                  {trendingMovie.length ? (
                        <div className="bg-[rgb(31,71,69)]  overflow-x-hidden w-full  h-full bg-[linear-gradient(27deg,_rgba(31,71,69,1)_10%,_rgba(16,36,27,1)_67%,_rgba(68,73,53,1)_100%)]">
                              <span className="flex px-5 py-5  gap-4 items-center">
                                    <h1 className="text-2xl text-white">Trending Movies</h1>
                                    <MdOutlineHorizontalRule size="1.4rem" color="white" />
                              </span>
                              <InfiniteScroll hasMore={true} next={getTrendingData} loader={<PageSkeleton />} dataLength={trendingMovie.length}>
                                    <div className="px-2 w-full overflow-x-hidden gap-x-6 gap-y-4 grid sm:grid-cols-3 grid-cols-2 ">{trendingMovie && trendingMovie.map((eachMovie, index) => <Card type="movie" key={index} eachMovie={eachMovie} />)}</div>
                              </InfiniteScroll>
                        </div>
                  ) : (
                        <PageSkeleton />
                  )}
            </>
      );
};

export default Trending;
