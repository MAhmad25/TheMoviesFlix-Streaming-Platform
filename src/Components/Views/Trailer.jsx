import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import NotFound from "../partials/NotFound";

const Trailer = () => {
      let { pathname } = useLocation();
      const isMovie = pathname.includes("movie") ? "movie" : "tv";
      const video = useSelector((state) => state[isMovie].info.videoLink);
      return (
            <>
                  {video ? (
                        <section className="w-screen absolute top-0 flex justify-center  left-0 bg-black/70 backdrop-blur-3xl h-full">
                              <div className="mt-20 top-20 left-0 z-50 fixed">
                                    <ReactPlayer url={`https://www.youtube.com/watch?v=${video.key}`} height={300} width={360} />
                              </div>
                        </section>
                  ) : (
                        <NotFound />
                  )}
            </>
      );
};

export default Trailer;
