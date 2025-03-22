/* eslint-disable react-hooks/exhaustive-deps */
import Card from "./Card";
import styles from "../../styles/TrendingContainer.module.css";
import { useEffect, useRef, useState } from "react";
import api from "../../utils/axios";
import { CiCircleChevRight } from "react-icons/ci";
import { CiCircleChevLeft } from "react-icons/ci";

const ComingSoonContainer = () => {
      const [comingSoon, setComingMovie] = useState([]);
      const containerRef = useRef(null);
      const touchStart = useRef({ x: 0, y: 0 });
      const [isEnd, setIsEnd] = useState(false);
      const [isStart, setIsStart] = useState(true);

      const getComingData = async () => {
            try {
                  const { data } = await api.get(`movie/upcoming?page=1`);
                  setComingMovie(data.results);
            } catch (error) {
                  console.log(error);
            }
      };

      useEffect(() => {
            getComingData();
      }, []);

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
                        left: -400,
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
                        left: 400,
                        behavior: "smooth",
                  });
            }
      };
      return (
            <section className="w-full relative  mb-10 px-5">
                  <div className="flex mb-2 justify-between items-center">
                        <h1 className="text-[#a5dbc9] sm:text-3xl sm:text-white text-xl">Now Playing</h1>
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
                        className={`flex ${styles.scrollbar}  overflow-x-auto  w-full gap-4 sm:gap-16 md:h-[30rem] sm:h-96 h-72 `}
                  >
                        {/* These are movie List controller  */}
                        <div onClick={scrollLeft} className={`absolute hidden md:block ${isStart ? "cursor-not-allowed opacity-10" : "cursor-auto opacity-100"}  bg-white/30 p-2 backdrop-blur-xl rounded-full left-0 top-[28%]`}>
                              <CiCircleChevLeft size="3rem" color="#e5e9de" />
                        </div>
                        <div onClick={scrollRight} className={`absolute hidden md:block ${isEnd ? "cursor-not-allowed opacity-10" : "cursor-auto opacity-100"}  bg-white/30 p-2 backdrop-blur-xl rounded-full right-0 top-[28%]`}>
                              <CiCircleChevRight size="3rem" color="#e5e9de" />
                        </div>
                        {comingSoon.map((eachMovie, index) => (
                              <div key={index} className="w-44 shrink-0">
                                    <Card type="movie" eachMovie={eachMovie} />
                              </div>
                        ))}
                  </section>
            </section>
      );
};

export default ComingSoonContainer;
