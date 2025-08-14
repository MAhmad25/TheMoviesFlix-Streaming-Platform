import { useEffect } from "react";
import { useParams } from "react-router-dom";
const WatchMovie = () => {
      const { id } = useParams();
      console.log(id);
      const movieUrl = `https://vidsrc.xyz/embed/movie/${id}`;
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
            <div className="w-full fixed no-scroll inset-0 z-50 backdrop-blur-xl h-[92dvh] md:h-screen  flex justify-center items-center">
                  <iframe title="Watch Movie" src={movieUrl} width={"95%"} height={"95%"} allow="autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
      );
};

export default WatchMovie;
