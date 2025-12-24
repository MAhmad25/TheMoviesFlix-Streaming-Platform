import { useCallback } from "react";
import RouterHandler from "../src/routes/RouterHandler";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { SearchProvider } from "./context/SearchContext";
const App = () => {
      const sound = new Audio("/sound/click.mp3");
      useCallback(() => {
            const handleClick = () => {
                  sound.play();
            };
            document.addEventListener("click", handleClick);
            return () => {
                  document.removeEventListener("click", handleClick);
            };
      }, []);
      return (
            <>
                  <SpeedInsights />
                  <SearchProvider>
                        <RouterHandler />
                  </SearchProvider>
            </>
      );
};

export default App;
