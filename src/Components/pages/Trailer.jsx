import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { NotFound } from "../ui/index";
import useFullScreen from "../../hooks/useFullScreen";

const Trailer = () => {
      useFullScreen();
      const { pathname } = useLocation();
      const isMovie = pathname.includes("movie") ? "movie" : "tv";
      const video = useSelector((state) => state[isMovie].info.videoLink);
      return (
            <>
                  {video ? (
                        <section className="w-full fixed no-scroll inset-0 z-50 backdrop-blur-xl h-[92dvh] md:h-screen  flex justify-center items-center">
                              <div className="w-[95%] h-[85%]  overflow-hidden rounded-xl">
                                    <ReactPlayer controls={true} url={`https://www.youtube.com/watch?v=${video.key}`} height="100%" width="100%" />
                              </div>
                        </section>
                  ) : (
                        <NotFound />
                  )}
            </>
      );
};

export default Trailer;
