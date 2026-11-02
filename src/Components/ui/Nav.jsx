import { useEffect, useState } from "react";
import { Flame, Home, Search, Tv, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { bind, play } from "cuelume";
import GlisseSurface from "./GlisseSurface";
import DiscreteTabs from "../discrete-tabs";
import DiscoverButton from "../discover-button";

const navItems = [
      { id: "home", to: "/", icon: Home, title: "Home", isNavigation: true },
      { id: "movies", to: "/trending", icon: Flame, title: "Movies", isNavigation: true },
      { id: "search", action: "search", icon: Search, title: "Search" },
      { id: "people", to: "/people", icon: Users, title: "Celebrity", isNavigation: true },
      { id: "tv", to: "/tv", icon: Tv, title: "TV Shows", isNavigation: true },
];

const NavBar = ({ className = "", defaultIndex = 0, stickyBottom = true }) => {
      const { pathname } = useLocation();
      const [searchOpen, setSearchOpen] = useState(false);
      const navigate = useNavigate();
      const routeTab = pathname.startsWith("/tv") ? "tv"
            : pathname.startsWith("/people") || pathname.startsWith("/person/") ? "people"
            : pathname.startsWith("/trending") || pathname.startsWith("/movie/") ? "movies"
            : navItems[defaultIndex]?.id || "home";
      const activeTab = searchOpen ? "search" : routeTab;

      useEffect(() => {
            bind();
      }, []);

      const handleTabChange = (id) => {
            const item = navItems.find((tab) => tab.id === id);
            if (!item) return;
            play("press");
            if (item.action === "search") {
                  setSearchOpen(true);
                  return;
            }
            setSearchOpen(false);
            navigate(item.to);
      };

      return (
            <GlisseSurface className={`bottom-navigation-glass max-w-[calc(100vw-16px)] ${stickyBottom ? "bottom-navigation-glass--sticky" : ""} ${className}`}>
                  <nav aria-label="Bottom Navigation" className="bottom-navigation relative flex min-w-0 items-center">
                        <DiscreteTabs
                              tabs={navItems}
                              value={activeTab}
                              onValueChange={handleTabChange}
                              onTabHover={() => play("tick")}
                        />
                        <DiscoverButton
                              expanded={searchOpen}
                              onExpandedChange={setSearchOpen}
                              showTrigger={false}
                              className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2"
                        />
                  </nav>
            </GlisseSurface>
      );
};

export default NavBar;
