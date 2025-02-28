/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Card from "../Components/partials/Card";
import api from "../utils/axios";
import Loader from "./partials/Loader";
import InfiniteScroll from "react-infinite-scroll-component";

const People = () => {
      const [popularPeople, setPopularPeople] = useState([]);
      const [page, setPage] = useState(1);

      const getPopularPeople = async () => {
            try {
                  const { data } = await api.get(`person/popular?page=${page}`);
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
                                    <h1 className="text-2xl tracking-tighter leading-none text-white">Trending People</h1>
                              </span>
                              <InfiniteScroll hasMore={true} next={getPopularPeople} loader={<Loader />} dataLength={popularPeople.length}>
                                    <div className="px-2 gap-x-6 gap-y-4 grid sm:grid-col-5 grid-cols-2 ">{popularPeople && popularPeople.map((eachPeople, index) => <Card type="person" key={index} eachMovie={eachPeople} />)}</div>
                              </InfiniteScroll>
                        </div>
                  ) : (
                        <Loader />
                  )}
            </>
      );
};

export default People;
