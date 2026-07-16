import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { NotFound } from "../ui/index";
import useFullScreen from "../../hooks/useFullScreen";
import { MdClose } from "react-icons/md";
import { Backlight } from "../ui/Backlight";

const Trailer = () => {
      useFullScreen();
      const navigate = useNavigate();
      const { pathname } = useLocation();
      const isMovie = pathname.includes("movie") ? "movie" : "tv";
      const video = useSelector((state) => state[isMovie].info.videoLink);
      const embedUrl = video?.key ? `https://www.youtube.com/embed/${video.key}?autoplay=0&controls=1&origin=${window.location.origin}` : "";

      return (
            <section
                  style={{
                        backgroundImage: "radial-gradient(transparent 1px, #14120b 1px)",
                        backgroundSize: "3px 3px",
                        backdropFilter: "brightness(1) blur(10px)",
                        willChange: "filter, opacity, transform",
                  }}
                  className="fixed inset-0 z-50 flex items-center justify-center w-full h-full"
            >
                  <span onClick={() => navigate(-1)} className="fixed z-10 cursor-pointer bg-white/30 backdrop-blur md:scale-110 rounded-full p-2 top-3 right-3">
                        <MdClose size="1.5rem" color="black" />
                  </span>

                  {video ? (
                        // Container: centered, 16:9, fits within the viewport
                        <div className="relative w-[95%] max-w-7xl aspect-video rounded-xl overflow-hidden">
                              {/* Glow layer: uses Backlight with a static coloured div */}
                              <Backlight blur={40} className="absolute inset-0 w-full h-full">
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500/50 to-purple-500/50" />
                              </Backlight>

                              {/* Video iframe: sits on top of the glow */}
                              <iframe src={embedUrl} title="Gradient Loop Background" className="absolute inset-0 w-full h-full" allowFullScreen frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" />
                        </div>
                  ) : (
                        <NotFound />
                  )}
            </section>
      );
};

export default Trailer;
