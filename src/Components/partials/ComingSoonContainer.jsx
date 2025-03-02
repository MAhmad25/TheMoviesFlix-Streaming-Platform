/* eslint-disable react-hooks/exhaustive-deps */
import Card from "./Card";
import styles from "../../styles/TrendingContainer.module.css";
import { useEffect, useRef, useState } from "react";
import api from "../../utils/axios";

const ComingSoonContainer = () => {
      const [comingSoon, setComingMovie] = useState([]);
      const [page, setPage] = useState(1);
      const containerRef = useRef(null);
      const touchStart = useRef({ x: 0, y: 0 });

      const getComingData = async () => {
            try {
                  const { data } = await api.get(`movie/upcoming?page=${page}`);
                  setComingMovie(data.results);
            } catch (error) {
                  console.log(error);
            }
      };

      useEffect(() => {
            getComingData();
            // const pageIncrement = setInterval(() => setPage((prev) => prev + 1), 30000);
            // return () => clearInterval(pageIncrement);
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
            console.log(e);
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

      return (
            <section className="w-full  mb-10 px-5">
                  <div className="flex mb-2 justify-between items-center">
                        <h1 className="text-[#a5dbc9] sm:text-3xl sm:text-white text-xl">Up-Coming Movies</h1>
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
                        className={`flex ${styles.scrollbar} overflow-x-auto  w-full gap-4 sm:gap-16 md:h-[30rem] sm:h-96 h-72 `}
                  >
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
