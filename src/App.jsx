import RouterHandler from "../src/routes/RouterHandler";
import { SpeedInsights } from "@vercel/speed-insights/react";
const App = () => {
      return (
            <>
                  <SpeedInsights />
                  <RouterHandler />
            </>
      );
};

export default App;
