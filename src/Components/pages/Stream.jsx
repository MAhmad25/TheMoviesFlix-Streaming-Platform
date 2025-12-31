import useFullScreen from "../../hooks/useFullScreen";
import { useNavigate, useParams } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";
const Stream = ({ category }) => {
      useFullScreen();
      const { id } = useParams();
      const navigate = useNavigate();
      const url = `https://vidsrc.to/embed/${category}/${id}`;
      return (
            <motion.div initial={{ opacity: 0, scaleY: 0, transformOrigin: "top" }} animate={{ opacity: 1, scaleY: 1, transition: { duration: 0.5, ease: "easeIn" } }} className="w-full fixed no-scroll inset-0 z-50 backdrop-blur-xl h-[92dvh] md:h-screen  flex justify-center items-center">
                  <span onClick={() => navigate(-1)} className="fixed cursor-pointer z-10 bg-white/30 backdrop-blur md:scale-125 rounded-full p-2 top-5 right-5">
                        <div>
                              <MdClose size="1.5rem" color="black" />
                        </div>
                  </span>
                  <iframe referrerPolicy="origin" title="Build By Ahmad" src={url} width={"95%"} height={"95%"} allow="autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </motion.div>
      );
};

export default Stream;
