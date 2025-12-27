import { createContext, useState } from "react";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
      const [searchModal, setSearchModal] = useState(false);
      const enableSearchScreen = () => {
            document.body.classList.add("overflow-y-scroll");
            document.documentElement.style.overflowX = "hidden";
            document.body.style.height = "100dvh";
            setSearchModal(true);
      };
      const disableSearchScreen = () => {
            setSearchModal(false);
            document.documentElement.style.overflowX = "auto";
            document.body.style.height = "auto";
            document.body.classList.remove("overflow-y-scroll");
      };
      const states = {
            searchModal,
            enableSearchScreen,
            disableSearchScreen,
      };
      return <SearchContext.Provider value={states}>{children}</SearchContext.Provider>;
};
export { SearchProvider, SearchContext };
