import { MdHomeFilled } from "react-icons/md";
import { FaFireAlt, FaSearch } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { RiTvFill } from "react-icons/ri";
import Dock from "./Dock/Dock";

const Navbar = () => {
      const size = "1.455rem";

      const dockItems = [
            {
                  to: "/",
                  icon: <MdHomeFilled size={size} />,
                  label: "Home",
            },
            {
                  to: "/trending",
                  icon: <FaFireAlt size={size} />,
                  label: "Trending",
            },
            {
                  to: "/search",
                  icon: <FaSearch size={size} />,
                  label: "Search",
            },
            {
                  to: "/people",
                  icon: <BsFillPeopleFill size={size} />,
                  label: "People",
            },
            {
                  to: "/tv",
                  icon: <RiTvFill size={size} />,
                  label: "TV Shows",
            },
      ];

      return (
            <nav className="w-full h-[10vh] pt-5  flex px-5 z-30 justify-center mx-auto sm:w-1/2 md:w-[40%] lg:w-[35%] min-[1150px]:w-[30%] sm:rounded-3xl overflow-visible items-center fixed bottom-0 sm:bottom-2 md:bottom-1 left-0 right-0 text-white backdrop-blur-md bg-[#0A1F18]/80">
                  <Dock items={dockItems} className="w-full" spring={{ mass: 0.2, stiffness: 120, damping: 10 }} magnification={80} distance={150} baseItemSize={50} />
            </nav>
      );
};

export default Navbar;
