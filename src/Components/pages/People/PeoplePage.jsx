import { useEffect, useState } from "react";
import { Card, PageSkeleton } from "../../ui/index";
import api from "../../../utils/axios";
import InfiniteScroll from "react-infinite-scroll-component";

const PeoplePage = () => {
      const [popularPeople, setPopularPeople] = useState([]);
      const [page, setPage] = useState(1);

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
                        <div className="bg-[rgb(31,71,69)] overflow-x-hidden w-full h-full bg-[linear-gradient(27deg,_rgba(31,71,69,1)_10%,_rgba(16,36,27,1)_67%,_rgba(68,73,53,1)_100%)]">
                              <span className="flex px-5 py-5 gap-4 items-center">
                                    <h1 className="text-2xl tracking-tighter sm:text-3xl md:text-4xl leading-none text-white">Trending Celebrities</h1>
                              </span>
                              <InfiniteScroll hasMore={true} next={getPopularPeople} loader={<PageSkeleton />} dataLength={popularPeople.length}>
                                    <div className="lg:px-3 px-2 overflow-x-hidden min-[1260px]:grid-cols-5 gap-x-6 md:grid-cols-3 gap-y-4  grid lg:grid-cols-4  grid-cols-2 ">{popularPeople && popularPeople.map((eachPeople, index) => <Card type="person" key={index} eachMovie={eachPeople} />)}</div>
                              </InfiniteScroll>
                        </div>
                  ) : (
                        <PageSkeleton />
                  )}
            </>
      );
};

export default PeoplePage;
