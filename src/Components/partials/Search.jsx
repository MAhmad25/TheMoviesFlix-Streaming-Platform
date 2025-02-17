import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { ImCross } from "react-icons/im";
import style from "../../styles/TrendingContainer.module.css";
const Search = () => {
      const [query, setQuery] = useState("");
      const [movieData, setMovieData] = useState([]);
      const getSearches = async () => {
            try {
                  const { data } = await api.get(`/search/multi?query=${query}`);
                  setMovieData(data.results);
            } catch (error) {
                  console.log(error);
            }
      };
      useEffect(() => {
            if (query.length <= 0) setMovieData([]);
            query && getSearches();
      }, [query]);
      return (
            <>
                  <section className={`w-full min-h-[100dvh] z-20 ${style.scrollbar}  bg-[rgb(31,71,69)] bg-[linear-gradient(27deg,_rgba(31,71,69,1)_10%,_rgba(16,36,27,1)_67%,_rgba(68,73,53,1)_100%)] backdrop-blur-xl  px-5 overflow-y-scroll text-white`}>
                        <motion.div initial={{ y: -100 }} animate={{ y: 0, transition: { ease: "backInOut", duration: 0.5 } }} className={`relative ${style.scrollbar} mt-5 w-full`}>
                              <input value={query} onChange={(e) => setQuery(e.target.value)} autoFocus className="w-full text-white pr-12 pl-14 outline-none border-none rounded-full bg-black/40 backdrop-blur-sm  py-3" placeholder="Search for movies, tv shows" type="text" />
                              <span className="absolute left-7 top-3 -translate-x-1/2">
                                    <IoSearchOutline color="#F5CD80" size="1.5rem" />
                              </span>
                              <motion.span whileTap={{ scale: 0.7 }} onClick={() => setQuery("")} className="absolute  w-9 h-9 flex justify-center items-center  right-3 top-2">
                                    <ImCross color="#F5CD80" size="1rem" />
                              </motion.span>
                        </motion.div>
                        <div className=" mb-20">
                              {movieData &&
                                    movieData.map((eachMovie, index) => (
                                          <Link to={`/${eachMovie.media_type}/details/${eachMovie.id}`} key={index} className="w-full px-5 flex  items-center gap-5  mt-3">
                                                <div className="w-20 shrink-0 h-20 rounded-xl overflow-hidden">
                                                      <img className="w-full h-full object-cover" src={eachMovie.backdrop_path || eachMovie.poster_path ? `https://image.tmdb.org/t/p/original${eachMovie.backdrop_path || eachMovie.poster_path} ` : "/noImage.jpg"} alt="Poster image" />
                                                </div>
                                                <h1 className="leading-none">{eachMovie.name || eachMovie.original_name || eachMovie.original_title}</h1>
                                          </Link>
                                    ))}
                        </div>
                  </section>
            </>
      );
};

export default Search;
