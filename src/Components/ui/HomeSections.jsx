import { useEffect, useState } from "react";
import api from "../../utils/axios";
import Slider from "./Slider";
const HomeSections = ({ url, sectionName }) => {
      const [data, setData] = useState([]);
      useEffect(() => {
            (async () => {
                  try {
                        const { data } = await api.get(url);
                        setData(data.results);
                  } catch (error) {
                        console.log(error.message);
                  }
            })();
      }, [url]);

      return (
            <section className="w-full sm:mb-10 relative  px-5">
                  <div className="flex w-full mb-3 justify-center items-center">
                        <span className="w-full  border-dotted border-[1px] border-gray-400"></span>
                        <h1 className="sm:text-3xl border-gray-400 border rounded-3xl px-4 py-2 text-nowrap  text-[#fefefe] text-xl">{sectionName}</h1>
                        <span className="w-full  border-dotted border-[1px] border-gray-400"></span>
                  </div>
                  <Slider trendingMovie={data} />
            </section>
      );
};

export default HomeSections;
