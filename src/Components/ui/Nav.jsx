import { useState } from "react";
import { motion } from "framer-motion";
import { MdHomeFilled } from "react-icons/md";
import { FaFireAlt } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { RiTvFill } from "react-icons/ri";
import { CgSearch } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
const navItems = [
      {
            to: "/",
            icon: MdHomeFilled,
            label: "Home",
      },
      {
            to: "/trending",
            icon: FaFireAlt,
            label: "Movies",
      },
      {
            icon: CgSearch,
            to: "/search",
            label: "Search",
      },
      {
            to: "/people",
            icon: BsFillPeopleFill,
            label: "Celebrity",
      },
      {
            to: "/tv",
            icon: RiTvFill,
            label: "TV Shows",
      },
];

const MOBILE_LABEL_WIDTH = 72;

const NavBar = ({ className = "", defaultIndex = 0, stickyBottom = true }) => {
      const [activeIndex, setActiveIndex] = useState(defaultIndex);
      const navigate = useNavigate();
      return (
            <motion.nav initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} role="navigation" aria-label="Bottom Navigation" className={`border-[#d66722]/30 border [background-image:var(--bg-gradient)] rounded-full flex items-center p-2 shadow-xl space-x-1 min-w-[320px] max-w-[95vw] h-[52px] ${stickyBottom && "fixed inset-x-0 bottom-4 mx-auto z-20 w-fit"} ${className}`}>
                  {navItems.map((item, idx) => {
                        const Icon = item.icon;
                        const isActive = activeIndex === idx;

                        return (
                              <motion.button
                                    key={item.label}
                                    whileTap={{ scale: 0.97 }}
                                    className={`flex items-center gap-0 px-3 py-2 rounded-full transition-colors duration-200 relative h-10 min-w-[44px] min-h-[40px] max-h-[44px] ${isActive ? "bg-[#fefefe]/10 dark:bg-[#fefefe]/15 text-[#fefefe] dark:text-[#fefefe] gap-2" : "bg-transparent text-muted-foreground dark:text-muted-foreground hover:bg-muted dark:hover:bg-muted"} focus:outline-none focus-visible:ring-0`}
                                    onClick={() => {
                                          setActiveIndex(idx);
                                          navigate(item.to);
                                    }}
                                    aria-label={item.label}
                                    type="button"
                              >
                                    <Icon size={22} color="#fefefe" aria-hidden className="transition-colors duration-200" />

                                    <motion.div
                                          initial={false}
                                          animate={{
                                                width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                                                opacity: isActive ? 1 : 0,
                                                marginLeft: isActive ? "8px" : "0px",
                                          }}
                                          transition={{
                                                width: { type: "spring", stiffness: 350, damping: 32 },
                                                opacity: { duration: 0.19 },
                                                marginLeft: { duration: 0.19 },
                                          }}
                                          className="overflow-hidden flex items-center max-w-[72px]"
                                    >
                                          <span className={`font-medium text-xs whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis text-[clamp(0.625rem,0.5263rem+0.5263vw,1rem)] leading-[1.9] ${isActive ? "text-[#fefefe]" : "opacity-0"} title=${item.label}`}>{item.label}</span>
                                    </motion.div>
                              </motion.button>
                        );
                  })}
            </motion.nav>
      );
};

export default NavBar;
