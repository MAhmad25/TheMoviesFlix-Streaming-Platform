import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MdHomeFilled } from "react-icons/md";
import { FaFireAlt } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { RiTvFill } from "react-icons/ri";
import { CgSearch } from "react-icons/cg";
import { useLocation, useNavigate } from "react-router-dom";
import { bind, play } from "cuelume";
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

const NavBar = ({ className = "", defaultIndex = 0, stickyBottom = true }) => {
      const { pathname } = useLocation();
      const reducedMotion = useReducedMotion();
      const activeIndex = pathname.startsWith("/tv") ? 4
            : pathname.startsWith("/people") || pathname.startsWith("/person/") ? 3
            : pathname.startsWith("/search") ? 2
            : pathname.startsWith("/trending") || pathname.startsWith("/movie/") ? 1
            : defaultIndex;
      const navigate = useNavigate();
      useEffect(() => {
            bind();
      }, []);
      return (
            <motion.nav initial={reducedMotion ? false : { scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} style={{ viewTransitionName: "route-navigation" }} aria-label="Bottom Navigation" className={`bottom-navigation border-[#d66722]/30 border [background-image:var(--bg-gradient)] rounded-full flex items-center p-1 shadow-xl gap-0.5 md:gap-1 min-w-0 max-w-[calc(100vw-16px)] h-[46px] ${stickyBottom ? "fixed inset-x-0 bottom-6 md:bottom-2 mx-auto z-20 w-fit" : ""} ${className}`}>
                  {navItems.map((item, idx) => {
                        const Icon = item.icon;
                        const isActive = activeIndex === idx;

                        return (
                              <motion.button
                                    onMouseEnter={() => play("tick")}
                                    key={item.label}
                                    whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                                    className={`flex shrink-0 items-center gap-0 px-[11px] py-1 rounded-full transition-colors duration-200 relative h-9 min-w-[44px] ${isActive ? "bg-[#fefefe]/10 dark:bg-[#fefefe]/15 text-[#fefefe]" : "bg-transparent"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff7949] focus-visible:outline-offset-2`}
                                    onClick={() => {
                                          play("press");
                                          navigate(item.to);
                                    }}
                                    aria-label={item.label}
                                    aria-current={isActive ? "page" : undefined}
                                    type="button"
                              >
                                    <Icon size={22} color="#fefefe" aria-hidden className="transition-colors duration-200" />

                                    <motion.div
                                          initial={false}
                                          animate={{
                                                width: isActive ? "auto" : 0,
                                                opacity: isActive ? 1 : 0,
                                                marginLeft: isActive ? 6 : 0,
                                          }}
                                          transition={reducedMotion ? { duration: 0 } : {
                                                width: { type: "spring", stiffness: 350, damping: 32 },
                                                opacity: { duration: 0.19 },
                                                marginLeft: { duration: 0.19 },
                                          }}
                                          aria-hidden="true"
                                          className="bottom-navigation__label overflow-hidden flex items-center"
                                    >
                                          <span className="font-medium whitespace-nowrap select-none overflow-hidden text-ellipsis text-[11px] md:text-xs leading-[1.9]" title={item.label}>{item.label}</span>
                                    </motion.div>
                              </motion.button>
                        );
                  })}
            </motion.nav>
      );
};

export default NavBar;
