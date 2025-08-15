import { Card } from "./index";
import { useEffect, useRef, useState } from "react";
import api from "../../utils/axios";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
const TrendingContainer = () => {
      const [trendingMovie, setTrendingMovie] = useState([]);
      const [query, setQuery] = useState("all");
      const containerRef = useRef(null);
      const touchStart = useRef({ x: 0, y: 0 });
      const [isEnd, setIsEnd] = useState(false);
      const [isStart, setIsStart] = useState(true);
      const getTrendingData = async () => {
            try {
                  const { data } = await api.get(`trending/${query}/day`);
                  setTrendingMovie(data.results);
            } catch (error) {
                  console.log(error);
            }
      };
      useEffect(() => {
            getTrendingData();
      }, [query]);
      const handleTouchStart = (e) => {
            touchStart.current = {
                  x: e.touches[0].clientX,
                  y: e.touches[0].clientY,
            };
            if (containerRef.current) {
                  containerRef.current.style.pointerEvents = "auto";
            }
      };

      const handleTouchMove = (e) => {
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const dx = Math.abs(currentX - touchStart.current.x);
            const dy = Math.abs(currentY - touchStart.current.y);
            if (dy > dx && containerRef.current) {
                  containerRef.current.style.pointerEvents = "none";
            } else if (containerRef.current) {
                  containerRef.current.style.pointerEvents = "auto";
            }
      };

      const handleTouchEnd = () => {
            if (containerRef.current) {
                  containerRef.current.style.pointerEvents = "auto";
            }
      };
      const scrollLeft = () => {
            if (containerRef.current) {
                  const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;
                  if (scrollLeft + clientWidth > scrollWidth) setIsEnd(true);
                  else setIsEnd(false);
                  if (scrollLeft > 0) setIsStart(false);
                  else setIsStart(true);
                  containerRef.current.scrollBy({
                        left: -600,
                        behavior: "smooth",
                  });
            }
      };
      const scrollRight = () => {
            const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;
            if (scrollLeft + clientWidth >= scrollWidth) setIsEnd(true);
            else setIsEnd(false);
            if (scrollLeft + clientWidth > 0) setIsStart(false);
            else setIsStart(true);
            if (containerRef.current) {
                  containerRef.current.scrollBy({
                        left: 600,
                        behavior: "smooth",
                  });
            }
      };
      return (
            <section className="w-full relative  px-5">
                  <div className="flex mb-3 justify-between items-center">
                        <h1 className="text-[#a5dbc9] sm:text-3xl sm:text-zinc-100 text-xl">Trending Now</h1>
                        <select onChange={(e) => setQuery(e.target.value)} className="outline-none bg-transparent  text-[#A5DBC9] border-[0.5px] rounded-xl text-xs sm:text-lg px-3 py-1" name="category" id="category">
                              <option className="text-green-900" defaultValue="all" value="all">
                                    All
                              </option>
                              <option className="text-green-900" value="tv">
                                    TV
                              </option>
                              <option className=" text-green-900 " value="movie">
                                    Movies
                              </option>
                        </select>
                  </div>
                  <section
                        style={{
                              WebkitOverflowScrolling: "touch",
                              touchAction: "auto",
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        ref={containerRef}
                        className="flex [&::-webkit-scrollbar]:hidden overflow-x-scroll  gap-4 sm:gap-16 md:h-[30rem] sm:h-96 h-72  w-full"
                  >
                        {/* These are movie List controller  */}
                        <div onClick={scrollLeft} className={`absolute z-20 hidden md:block ${isStart ? "cursor-not-allowed opacity-0" : "cursor-auto opacity-100"}  shadow-black backdrop-blur-sm py-48 px-1  rounded-md left-0 top-[9%]`}>
                              <FaChevronLeft size="2rem" color="#e5e9de" />
                        </div>
                        <div onClick={scrollRight} className={`absolute z-20 hidden md:block ${isEnd ? "cursor-not-allowed opacity-0" : "cursor-auto opacity-100"}  shadow-black backdrop-blur-sm py-48 px-1  rounded-md right-0 top-[9%]`}>
                              <FaChevronRight size="2rem" color="#e5e9de" />
                        </div>

                        {trendingMovie &&
                              trendingMovie.map((eachMovie, index) => (
                                    <div key={index} className=" w-44 shrink-0">
                                          <Card type="movie" eachMovie={eachMovie} />
                                    </div>
                              ))}
                  </section>
            </section>
      );
};

export default TrendingContainer;
