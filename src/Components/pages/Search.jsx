import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { useDebounce } from "@uidotdev/usehooks";

const Search = () => {
      document.title = "Search For Anything You Love !";
      const [query, setQuery] = useState("");
      const [movieData, setMovieData] = useState([]);

      const debouncedQuery = useDebounce(query, 400);

      const getSearches = async () => {
            try {
                  const { data } = await api.get(`/search/multi?query=${debouncedQuery}`);
                  setMovieData(data.results);
            } catch (error) {
                  console.log(error.message);
            }
      };

      useEffect(() => {
            if (debouncedQuery.length <= 0) {
                  setMovieData([]);
                  return;
            }
            getSearches();
      }, [debouncedQuery]);

      return (
            <>
                  <section className="w-full min-h-dvh  [&::-webkit-scrollbar]:hidden flex flex-col items-center  [background-image:var(--bg-gradient)] ">
                        <motion.div initial={{ y: -100 }} animate={{ y: 0, transition: { ease: "backInOut", duration: 0.5 } }} className="relative [&::-webkit-scrollbar]:hidden  top-3 lg:w-1/2 w-[80%]">
                              <input value={query} onChange={(e) => setQuery(e.target.value)} autoFocus className="w-full text-[#F5CD80] pr-12 pl-14 outline-none font-primary border-none rounded-full md:rounded-2xl bg-[#412f2d]/30  caret-[#d0ab67] selection:bg-[#F5CD80] selection:text-black backdrop-blur-xl md:text-xl lg:text-2xl py-3" placeholder="Search for movies, tv shows, people" type="text" />
                              <span className="absolute left-7 lg:top-4 top-3 -translate-x-1/2">
                                    <IoSearchOutline color="#F5CD80" size="1.5rem" />
                              </span>
                              <motion.span whileTap={{ scale: 0.7 }} onClick={() => setQuery("")} className="absolute w-9 h-9 flex justify-center items-center right-3 top-2">
                                    <ImCross color="#F5CD80" size="1rem" />
                              </motion.span>
                        </motion.div>
                        <motion.div className="mb-20 space-y-10 mt-10 lg:w-1/2">
                              {movieData?.map((eachMovie, index) => (
                                    <Link to={`/${eachMovie.media_type}/details/${eachMovie.id}`} key={index} className="w-full text-white px-5 flex items-center gap-5 mt-3">
                                          <div className="w-20 shrink-0 h-20 overflow-hidden rounded-md">
                                                <img className="w-full h-full object-cover" src={eachMovie?.backdrop_path ? `https://image.tmdb.org/t/p/w185/${eachMovie?.backdrop_path}` : "/noImage.jpg"} alt="" />
                                          </div>
                                          <h2 className="leading-none text-2xl">
                                                {eachMovie.name || eachMovie.original_name || eachMovie.original_title} <span className="text-sm font-bold border border-yellow-300 px-4 py-1 rounded-full text-yellow-300">{eachMovie?.media_type?.toUpperCase()}</span>
                                          </h2>
                                    </Link>
                              ))}
                        </motion.div>
                  </section>
            </>
      );
};

export default Search;
