import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Flame, Home, Search, Tv, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { bind, play } from "cuelume";
import { TabBar } from "glisse";
import DiscoverButton from "../discover-button";

const navItems = [
      { id: "home", to: "/", icon: Home, title: "Home" },
      { id: "movies", to: "/trending", icon: Flame, title: "Movies" },
      { id: "search", action: "search", icon: Search, title: "Search" },
      { id: "people", to: "/people", icon: Users, title: "Celebrity" },
      { id: "tv", to: "/tv", icon: Tv, title: "TV Shows" },
];

const tabItems = navItems.map(({ id, icon: Icon, title }) => ({
      value: id,
      label: (
            <span className="bottom-navigation__tab-content">
                  <Icon className="bottom-navigation__tab-icon" aria-hidden="true" />
                  <span className="bottom-navigation__tab-text">{title}</span>
            </span>
      ),
}));

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

      return typeof document === "undefined" ? null : createPortal(
            <div className={`bottom-navigation-glass max-w-[calc(100vw-16px)] ${stickyBottom ? "bottom-navigation-glass--sticky" : ""} ${className}`}>
                  <nav aria-label="Primary navigation" className="bottom-navigation relative flex min-w-0 items-center">
                        <TabBar
                              aria-label="Primary destinations"
                              className="bottom-navigation__tab-bar"
                              items={tabItems}
                              value={activeTab}
                              onValueChange={handleTabChange}
                        />
                        <DiscoverButton
                              expanded={searchOpen}
                              onExpandedChange={setSearchOpen}
                              showTrigger={false}
                              className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2"
                        />
                  </nav>
            </div>,
            document.body
      );
};

export default NavBar;
