/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { ImCross } from "react-icons/im";
import style from "../../styles/TrendingContainer.module.css";
import axios from "axios";
const Search = () => {
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
                  <section className={`w-full min-h-dvh   ${style.scrollbar}  lg:flex lg:flex-col lg:items-center  bg-[rgb(31,71,69)] bg-[linear-gradient(27deg,_rgba(31,71,69,1)_10%,_rgba(16,36,27,1)_67%,_rgba(68,73,53,1)_100%)] backdrop-blur-xl  px-5 overflow-y-scroll text-white`}>
                        <motion.div initial={{ y: -100 }} animate={{ y: 0, transition: { ease: "backInOut", duration: 0.5 } }} className={`relative ${style.scrollbar} mt-5 lg:w-3/4 w-full`}>
                              <input value={query} onChange={(e) => setQuery(e.target.value)} autoFocus className="w-full text-[#F5CD80] pr-12 pl-14 outline-none font-Stoshi border-none rounded-full bg-black/40 caret-[#d0ab67]  selection:bg-[#F5CD80] selection:text-black backdrop-blur-sm md:text-xl lg:text-2xl  py-3" placeholder="Search for movies, tv shows, people" type="text" />
                              <span className="absolute left-7 lg:top-4 top-3 -translate-x-1/2">
                                    <IoSearchOutline color="#F5CD80" size="1.5rem" />
                              </span>
                              <motion.span whileTap={{ scale: 0.7 }} onClick={() => setQuery("")} className="absolute  w-9 h-9 flex justify-center items-center  right-3 top-2">
                                    <ImCross color="#F5CD80" size="1rem" />
                              </motion.span>
                        </motion.div>
                        <div className="mb-20  lg:flex gap-3 lg:flex-col lg:items-center lg:w-3/4">
                              {movieData &&
                                    movieData.map((eachMovie, index) => (
                                          <Link to={`/${eachMovie.media_type}/details/${eachMovie.id}`} key={index} className="w-full px-5 flex  items-center gap-5  mt-3">
                                                <div className="w-20 md:w-28 lg:w-40 lg:h-40 md:h-28 shrink-0 h-20 rounded-xl overflow-hidden">
                                                      <img className="w-full h-full object-cover" src={eachMovie.backdrop_path || eachMovie.poster_path || eachMovie.profile_path ? `https://image.tmdb.org/t/p/original${eachMovie.backdrop_path || eachMovie.poster_path || eachMovie.profile_path} ` : "/noImage.jpg"} alt="Poster image" />
                                                </div>
                                                <h1 className="leading-none lg:text-2xl md:text-xl">{eachMovie.name || eachMovie.original_name || eachMovie.original_title}</h1>
                                          </Link>
                                    ))}
                        </div>
                  </section>
            </>
      );
};

export default Search;
