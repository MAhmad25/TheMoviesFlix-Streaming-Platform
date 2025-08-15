import useFullScreen from "../../hooks/useFullScreen";
import { useParams } from "react-router-dom";

const Stream = ({ category }) => {
      useFullScreen();
      const { id } = useParams();
      const url = `https://vidsrc.xyz/embed/${category}/${id}`;
      return (
            <div className="w-full fixed no-scroll inset-0 z-50 backdrop-blur-xl h-[92dvh] md:h-screen  flex justify-center items-center">
                  <iframe title="Watch Movie" src={url} width={"95%"} height={"95%"} allow="autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
      );
};

export default Stream;
