import { useEffect, useState } from "react";
import { Card, PageSkeleton, CastLoader } from "../../ui/index";
import api from "../../../utils/axios";
import InfiniteScroll from "react-infinite-scroll-component";

const PeoplePage = () => {
      const [popularPeople, setPopularPeople] = useState([]);
      const [page, setPage] = useState(1);
      document.title = "Trending Celebrities";
      const getPopularPeople = async () => {
            try {
                  const { data } = await api.get(`trending/person/day?page=${page}`);
                  setPopularPeople((prevData) => [...prevData, ...data.results]);
                  setPage((prev) => prev + 1);
            } catch (error) {
                  console.log(error);
            }
      };

      useEffect(() => {
            getPopularPeople();
      }, []);
      return (
            <>
                  {popularPeople.length ? (
                        <div className="overflow-x-hidden [background-image:var(--bg-gradient)] w-full min-h-dvh pb-28">
                              <span className="flex flex-wrap px-5 py-5 gap-4 items-center">
                                    <h1 className="text-2xl tracking-tighter sm:text-3xl md:text-4xl leading-none text-white">Trending Celebrities</h1>
                              </span>
                              <InfiniteScroll hasMore={true} next={getPopularPeople} loader={<CastLoader />} dataLength={popularPeople.length}>
                                    <div className="media-grid px-3 w-full gap-3 md:gap-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-[1260px]:grid-cols-5">{popularPeople && popularPeople.map((eachPeople, index) => <Card type="person" key={index} eachMovie={eachPeople} />)}</div>
                              </InfiniteScroll>
                        </div>
                  ) : (
                        <PageSkeleton />
                  )}
            </>
      );
};

export default PeoplePage;
