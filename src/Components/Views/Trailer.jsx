import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import NotFound from "../partials/NotFound";
import { useEffect } from "react";

const Trailer = () => {
      let { pathname } = useLocation();
      const isMovie = pathname.includes("movie") ? "movie" : "tv";
      const video = useSelector((state) => state[isMovie].info.videoLink);
      useEffect(() => {
            document.body.classList.add("overflow-hidden");
            document.documentElement.style.overflow = "hidden";
            document.body.style.height = "100dvh";
            return () => {
                  document.documentElement.style.overflow = "auto";
                  document.body.style.height = "";
                  document.body.classList.remove("overflow-hidden");
            };
      }, []);
      return (
            <>
                  {video ? (
                        <section className="w-screen no-scroll fixed inset-0  flex justify-center items-center  bg-black/70 backdrop-blur-sm h-screen">
                              <div className="w-full mb-44 sm:w-[80%] sm:mb-0 h-80 sm:h-[25rem] min-[1250px]:h-[27rem]">
                                    <ReactPlayer url={`https://www.youtube.com/watch?v=${video.key}`} height="100%" width="100%" />
                              </div>
                        </section>
                  ) : (
                        <NotFound />
                  )}
            </>
      );
};

export default Trailer;
