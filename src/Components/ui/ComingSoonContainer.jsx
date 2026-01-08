import { useEffect, useState } from "react";
import api from "../../utils/axios";
import Slider from "./Slider";
const ComingSoonContainer = () => {
      const [upcomingMovies, setComingMovie] = useState([]);
      useEffect(() => {
            (async () => {
                  try {
                        const { data } = await api.get(`movie/upcoming?page=1`);
                        setComingMovie(data.results);
                  } catch (error) {
                        console.log(error);
                  }
            })();
      }, []);

      return (
            <section className="w-full mb-28 relative  px-5">
                  <div className="flex w-full mb-3 justify-center items-center">
                        <span className="w-full  border-dotted border-[1px] border-gray-400"></span>
                        <h1 className="sm:text-3xl text-nowrap  text-[#fefefe] text-xl">Now Playing</h1>
                        <span className="w-full  border-dotted border-[1px] border-gray-400"></span>
                  </div>
                  <Slider trendingMovie={upcomingMovies} />
            </section>
      );
};

export default ComingSoonContainer;
