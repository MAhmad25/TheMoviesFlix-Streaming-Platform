import useFullScreen from "../../hooks/useFullScreen";
import { useNavigate, useParams } from "react-router-dom";
import { MdClose } from "react-icons/md";
const Stream = ({ category }) => {
      useFullScreen();
      const { id, season, seasonID } = useParams();
      const navigate = useNavigate();
      let url;
      if (category == "tv") url = `https://web.nxsha.app/embed/tv/${id}/${season}/${seasonID}?lang=hindi&autoplay=true/`;
      else url = `https://web.nxsha.app/embed/${category}/${id}?lang=hindi&autoplay=true`;
      return (
            <section
                  style={{
                        backgroundImage: "radial-gradient(transparent 1px, #14120b 1px)",
                        backgroundSize: "3px 3px",
                        backdropFilter: "brightness(1) blur(10px)",
                        willChange: "filter, opacity, transform",
                  }}
                  className="w-full fixed no-scroll inset-0 z-50  h-[92dvh] md:h-screen  flex justify-center items-center"
            >
                  <span onClick={() => navigate(-1)} className="fixed cursor-pointer z-10 bg-white/30 backdrop-blur md:scale-110 rounded-full p-2 top-3 right-3">
                        <div>
                              <MdClose size="1.5rem" color="black" />
                        </div>
                  </span>
                  <iframe referrerPolicy="origin" title="Build By Ahmad" src={url} width={"95%"} height={"95%"} allow="autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </section>
      );
};

export default Stream;
