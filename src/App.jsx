import RouterHandler from "../src/routes/RouterHandler";
import { ReactLenis, useLenis } from "lenis/react";
const App = () => {
      useLenis();
      return (
            <div className="bg-[#300b07]">
                  <ReactLenis root />
                  <RouterHandler />;
            </div>
      );
};

export default App;
