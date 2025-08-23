import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { NotFound } from "../ui/index";
import { motion } from "motion/react";
import useFullScreen from "../../hooks/useFullScreen";

const Trailer = () => {
      useFullScreen();
      const { pathname } = useLocation();
      const isMovie = pathname.includes("movie") ? "movie" : "tv";
      const video = useSelector((state) => state[isMovie].info.videoLink);
      return (
            <>
                  {video ? (
                        <motion.section initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-screen no-scroll fixed inset-0 flex justify-center items-center z-10  bg-black/70 backdrop-blur-sm h-screen">
                              <div className="w-full mb-44 sm:w-[80%] sm:mb-0 h-80 sm:h-[25rem] min-[1250px]:h-[27rem] overflow-hidden rounded-2xl">
                                    <ReactPlayer url={`https://www.youtube.com/watch?v=${video.key}`} height="100%" width="100%" />
                              </div>
                        </motion.section>
                  ) : (
                        <NotFound />
                  )}
            </>
      );
};

export default Trailer;
