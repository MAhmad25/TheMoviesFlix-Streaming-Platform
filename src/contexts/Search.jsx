import { createContext, useState } from "react";

export const SearchState = createContext();
const SearchContext = (prop) => {
      const [isSearchEnable, setSearchEnable] = useState(false);
      return <SearchState.Provider value={{ isSearchEnable, setSearchEnable }}>{prop.children}</SearchState.Provider>;
};
export default SearchContext;
