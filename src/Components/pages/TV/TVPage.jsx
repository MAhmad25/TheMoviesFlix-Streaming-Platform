import { useEffect, useRef, useState } from "react";
import { Card, PageSkeleton, CastLoader, AnimatedDropdown } from "../../ui/index";
import api from "../../../utils/axios";
import InfiniteScroll from "react-infinite-scroll-component";
const TVPage = () => {
      document.title = "Trending TV Shows - Watch and Stream Unlimited Movies and TV Series";
      const [trendingTV, setTrendingTV] = useState([]);
      const [page, setPage] = useState(1);
      const [category, setCategory] = useState("airing_today");
      const [hasMore, setHasMore] = useState(true);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(false);
      const requestRef = useRef(null);
      const loadMoreTV = async () => {
            const controller = requestRef.current;
            if (!controller || controller.signal.aborted) return;
            try {
                  const { data } = await api.get(`tv/${category}?language=en-US&page=${page + 1}`, { signal: controller.signal });
                  setTrendingTV((prevData) => [...prevData, ...data.results]);
                  setPage((prev) => prev + 1);
                  setHasMore(data.page < data.total_pages);
            } catch (error) {
                  if (!controller.signal.aborted) console.log(error);
            }
      };

      useEffect(() => {
            const controller = new AbortController();
            requestRef.current = controller;
            setPage(1);
            setTrendingTV([]);
            setHasMore(true);
            setLoading(true);
            setError(false);
            (async () => {
                  try {
                        const { data } = await api.get(`tv/${category}?language=en-US&page=1`, { signal: controller.signal });
                        setTrendingTV(data.results);
                        setHasMore(data.page < data.total_pages);
                  } catch (error) {
                        if (!controller.signal.aborted) {
                              console.log(error);
                              setError(true);
                        }
                  } finally {
                        if (!controller.signal.aborted) setLoading(false);
                  }
            })();
            return () => controller.abort();
      }, [category]);
      return (
            <div className="overflow-x-hidden w-full min-h-dvh pb-28 [background-image:var(--bg-gradient)]">
                  <div className="flex flex-wrap px-5 py-5 gap-4 items-center">
                        <h1 className="text-2xl tracking-tighter leading-none text-white">Trending TV Shows</h1>
                        <AnimatedDropdown
                              items={[
                                    { name: "On the Air", value: "on_the_air" },
                                    { name: "Popular Today", value: "airing_today" },
                                    { name: "Popular", value: "popular" },
                              ]}
                              value={category}
                              label="TV series category"
                              onSelect={(value) => setCategory(value)}
                        />
                  </div>
                  {loading ? <PageSkeleton /> : error ? (
                        <p role="status" className="px-5 text-white">Couldn’t load TV series. Try another category.</p>
                  ) : trendingTV.length ? (
                        <InfiniteScroll key={category} hasMore={hasMore} next={loadMoreTV} loader={<CastLoader />} dataLength={trendingTV.length}>
                              <div className="media-grid px-3 w-full gap-3 md:gap-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">{trendingTV.map((eachTV, index) => <Card type="tv" key={index} eachMovie={eachTV} />)}</div>
                        </InfiniteScroll>
                  ) : (
                        <p role="status" className="px-5 text-white">No TV series found in this category.</p>
                  )}
            </div>
      );
};

export default TVPage;
