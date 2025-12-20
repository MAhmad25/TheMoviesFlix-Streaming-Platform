import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { NotFound } from "../ui/index";
import useFullScreen from "../../hooks/useFullScreen";
import { MdClose } from "react-icons/md";

const Trailer = () => {
      useFullScreen();
      const navigate = useNavigate();
      const { pathname } = useLocation();
      const isMovie = pathname.includes("movie") ? "movie" : "tv";
      const video = useSelector((state) => state[isMovie].info.videoLink);
      return (
            <section className="w-full fixed no-scroll inset-0 z-50 backdrop-blur-xl h-[92dvh] md:h-screen  flex justify-center items-center">
                  <span onClick={() => navigate(-1)} className="fixed cursor-pointer z-10 bg-white/30 backdrop-blur md:scale-125 rounded-full p-2 top-5 right-5">
                        <div>
                              <MdClose size="1.5rem" color="black" />
                        </div>
                  </span>
                  {video ? (
                        <div className="w-[95%] h-[95%]  overflow-hidden rounded-xl">
                              <ReactPlayer controls={true} url={`https://www.youtube.com/watch?v=${video.key}`} height="100%" width="100%" />
                        </div>
                  ) : (
                        <NotFound />
                  )}
            </section>
      );
};

export default Trailer;
