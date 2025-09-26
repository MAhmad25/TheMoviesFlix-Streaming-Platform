import { useEffect } from "react";
import RouterHandler from "../src/routes/RouterHandler";
import { SpeedInsights } from "@vercel/speed-insights/react";
const App = () => {
      const sound = new Audio("/sound/click.mp3");
      useEffect(() => {
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
                  <RouterHandler />
            </>
      );
};

export default App;