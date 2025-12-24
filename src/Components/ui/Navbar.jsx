import { MdHomeFilled } from "react-icons/md";
import { FaFireAlt, FaSearch } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { RiTvFill } from "react-icons/ri";
import { Dock, LiquidGlass } from "./index";
import { useContext, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
const Navbar = () => {
      const size = "1.455rem";
      const { searchModal, enableSearchScreen, disableSearchScreen } = useContext(SearchContext);
      const location = useLocation();

      const handleSearchClick = useCallback(() => {
            if (searchModal) disableSearchScreen();
            else enableSearchScreen();
      }, [searchModal, enableSearchScreen, disableSearchScreen]);

      useEffect(() => {
            if (searchModal) disableSearchScreen();
      }, [location.pathname]);

      const dockItems = [
            {
                  to: "/",
                  icon: <MdHomeFilled size={size} />,
                  label: "Home",
            },
            {
                  to: "/trending",
                  icon: <FaFireAlt size={size} />,
                  label: "Movies",
            },
            {
                  onClick: handleSearchClick,
                  active: searchModal,
                  icon: <FaSearch size={size} />,
                  label: "Search",
            },
            {
                  to: "/people",
                  icon: <BsFillPeopleFill size={size} />,
                  label: "Celebrity",
            },
            {
                  to: "/tv",
                  icon: <RiTvFill size={size} />,
                  label: "TV Shows",
            },
      ];

      return (
            <>
                  <LiquidGlass />
                  <nav className="w-full rounded-t-3xl  h-[10vh] pt-5  flex px-5 z-30 justify-center mx-auto sm:w-1/2 md:w-[40%] lg:w-[35%] min-[1150px]:w-[30%] sm:rounded-3xl overflow-visible items-center fixed bottom-0 sm:bottom-2 md:bottom-1 left-0 right-0 text-white  backdrop-blur-[1px]">
                        <Dock items={dockItems} className="w-full" spring={{ mass: 0.2, stiffness: 120, damping: 10 }} magnification={80} distance={150} baseItemSize={50} />
                  </nav>
            </>
      );
};

export default Navbar;
