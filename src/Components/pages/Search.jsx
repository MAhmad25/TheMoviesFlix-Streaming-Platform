import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { ImCross } from "react-icons/im";
import axios from "axios";
const Search = () => {
      document.title = "Search For Anything You Love !";
      const [query, setQuery] = useState("");
      const [movieData, setMovieData] = useState([]);
      const controller = new AbortController();
      const getSearches = async () => {
            try {
                  const { data } = await api.get(`/search/multi?query=${query}`, {
                        signal: controller.signal,
                  });
                  setMovieData(data.results);
            } catch (error) {
                  if (axios.isCancel(error)) {
                        console.log(error.message);
                        return;
                  }
                  console.log(error.message);
            }
      };
      useEffect(() => {
            if (query.length <= 0) setMovieData([]);
            query && getSearches();
            return () => controller.abort;
      }, [query]);
      return (
            <>
                  <section className="w-full min-h-dvh  [&::-webkit-scrollbar]:hidden lg:flex lg:flex-col lg:items-center  [background-image:var(--bg-gradient)] ">
                        <motion.div initial={{ y: -100 }} animate={{ y: 0, transition: { ease: "backInOut", duration: 0.5 } }} className="relative [&::-webkit-scrollbar]:hidden top-3 lg:w-1/2 w-full">
                              <input value={query} onChange={(e) => setQuery(e.target.value)} autoFocus className="w-full text-[#F5CD80] pr-12 pl-14 outline-none   font-primary border-none rounded-full md:rounded-2xl bg-black/40 caret-[#d0ab67]  selection:bg-[#F5CD80] selection:text-black backdrop-blur-sm md:text-xl lg:text-2xl  py-3" placeholder="Search for movies, tv shows, people" type="text" />
                              <span className="absolute left-7 lg:top-4 top-3 -translate-x-1/2">
                                    <IoSearchOutline color="#F5CD80" size="1.5rem" />
                              </span>
                              <motion.span whileTap={{ scale: 0.7 }} onClick={() => setQuery("")} className="absolute  w-9 h-9 flex justify-center items-center  right-3 top-2">
                                    <ImCross color="#F5CD80" size="1rem" />
                              </motion.span>
                        </motion.div>
                        <motion.div className="mb-20 space-y-10 mt-10 lg:w-1/2">
                              {movieData?.map((eachMovie, index) => (
                                    <Link to={`/${eachMovie.media_type}/details/${eachMovie.id}`} key={index} className="w-full text-white px-5 flex  items-center gap-5  mt-3">
                                          <h1 className="leading-none text-2xl">{eachMovie.name || eachMovie.original_name || eachMovie.original_title}</h1>
                                    </Link>
                              ))}
                        </motion.div>
                  </section>
            </>
      );
};

export default Search;
