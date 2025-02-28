import { MdHomeFilled } from "react-icons/md";
import { FaFireAlt } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { RiTvFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { motion } from "motion/react";

const Navbar = () => {
      const size = "1.455rem";
      const [textColor, bgColor] = ["#94CDAA", "#0A1F18"];
      return (
            <nav className="w-full  h-[10vh] flex px-6 z-30 justify-center mx-auto sm:w-1/2 md:w-[40%]  sm:rounded-3xl overflow-hidden items-center fixed bottom-0 sm:bottom-2 md:bottom-1 left-0 right-0 text-white backdrop-blur-md  bg-[#0A1F18]/80">
                  <motion.section initial={{ y: 100 }} animate={{ y: 0, transition: { duration: 0.7, ease: "backInOut" } }} className="flex w-full  justify-between  items-center">
                        <Link to="/">
                              <motion.div className="p-2 text-[#94CDAA]   rounded-full" whileHover={{ backgroundColor: textColor, color: bgColor, y: -5 }}>
                                    <MdHomeFilled size={size} />
                              </motion.div>
                        </Link>
                        <Link to="/trending">
                              <motion.div className="p-2 text-[#94CDAA]   rounded-full" whileHover={{ backgroundColor: textColor, color: bgColor, y: -5 }}>
                                    <FaFireAlt size={size} />
                              </motion.div>
                        </Link>
                        <Link to="/search" whileTap={{ scale: 0.8 }}>
                              <FaSearch color={textColor} size={size} />
                        </Link>
                        <Link to="/people">
                              <motion.div className="p-2 text-[#94CDAA]  rounded-full" whileHover={{ backgroundColor: textColor, color: bgColor, y: -5 }}>
                                    <BsFillPeopleFill size={size} />
                              </motion.div>
                        </Link>
                        <Link to="/tv">
                              <motion.div className="p-2 text-[#94CDAA]  rounded-full" whileHover={{ backgroundColor: textColor, color: bgColor, y: -5 }}>
                                    <RiTvFill size={size} />
                              </motion.div>
                        </Link>
                  </motion.section>
            </nav>
      );
};

export default Navbar;
