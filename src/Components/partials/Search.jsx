import { motion } from "motion/react";
import { useContext, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { ImCross } from "react-icons/im";
import style from "../../styles/TrendingContainer.module.css";
import { SearchState } from "../../contexts/Search";
const Search = () => {
      const [query, setQuery] = useState("");
      const [movieData, setMovieData] = useState([]);
      const { setSearchEnable } = useContext(SearchState);
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
                  <motion.section initial={{ y: -100 }} animate={{ y: 0, transition: { ease: "backInOut", duration: 0.5 } }} className={`w-full h-full z-20 ${style.scrollbar}  absolute top-0 left-0 bg-black/50 backdrop-blur-xl  px-5 overflow-y-scroll text-white`}>
                        <div className={`relative ${style.scrollbar} mt-5 w-full`}>
                              <input value={query} onChange={(e) => setQuery(e.target.value)} autoFocus className="w-full text-white pr-12 pl-14 outline-none border-none rounded-full bg-black/40 backdrop-blur-sm  py-3" placeholder="Search for movies, tv shows" type="text" />
                              <span className="absolute left-7 top-3 -translate-x-1/2">
                                    <IoSearchOutline color="#F5CD80" size="1.5rem" />
                              </span>
                              <motion.span whileTap={{ scale: 0.7 }} onClick={() => setQuery("")} className="absolute  w-9 h-9 flex justify-center items-center  right-3 top-2">
                                    <ImCross color="#F5CD80" size="1rem" />
                              </motion.span>
                        </div>
                        {movieData &&
                              movieData.map((eachMovie, index) => (
                                    <Link onClick={() => setSearchEnable(false)} to={`/${eachMovie.media_type}/details/${eachMovie.id}`} key={index} className="w-full px-5 flex  items-center gap-5  mt-5">
                                          <div className="w-20 shrink-0 h-20 rounded-xl overflow-hidden">
                                                <img className="w-full h-full object-cover" src={eachMovie.backdrop_path || eachMovie.poster_path ? `https://image.tmdb.org/t/p/original${eachMovie.backdrop_path || eachMovie.poster_path} ` : "/noImage.jpg"} alt="Poster image" />
                                          </div>
                                          <h1>{eachMovie.name || eachMovie.original_name || eachMovie.original_title}</h1>
                                    </Link>
                              ))}
                  </motion.section>
            </>
      );
};

export default Search;
