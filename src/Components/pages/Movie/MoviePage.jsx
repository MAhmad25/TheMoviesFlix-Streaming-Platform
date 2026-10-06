import { useEffect, useState } from "react";
import { Card, CastLoader, PageSkeleton } from "../../ui/index";
import api from "../../../utils/axios";
import { MdOutlineHorizontalRule } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";

const MoviePage = () => {
      document.title = "The Movies Flix | Trending Movies - Watch and Stream Unlimited Movies and TV Series";
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
                  <div className="overflow-x-hidden w-full min-h-dvh pb-28 [background-image:var(--bg-gradient)]">
                        <span className="flex flex-wrap px-5 py-5  gap-4 items-center">
                              <h1 className="text-2xl text-white">Trending Movies</h1>
                              <MdOutlineHorizontalRule size="1.4rem" color="white" />
                        </span>
                        {trendingMovie.length > 0 ? (
                              <InfiniteScroll hasMore={true} next={getTrendingData} loader={<CastLoader />} dataLength={trendingMovie.length}>
                                    <div className="media-grid px-3 w-full gap-3 md:gap-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">{trendingMovie && trendingMovie.map((eachMovie, index) => <Card type="movie" key={index} eachMovie={eachMovie} />)}</div>
                              </InfiniteScroll>
                        ) : (
                              <PageSkeleton />
                        )}
                  </div>
            </>
      );
};

export default MoviePage;
