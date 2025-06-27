import RouterHandler from "../src/routes/RouterHandler";
import LocomotiveScroll from "locomotive-scroll";
import { SpeedInsights } from "@vercel/speed-insights/react";
const App = () => {
      new LocomotiveScroll();
      return (
            <>
                  <SpeedInsights />
                  <RouterHandler />
            </>
      );
};

export default App;
