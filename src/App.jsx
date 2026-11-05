import { useEffect } from "react";
import RouterHandler from "../src/routes/RouterHandler";
import { ReactLenis } from "lenis/react";
import { markAppMounted } from "./utils/initialLoad";

const App = () => {
      useEffect(() => {
            markAppMounted();
      }, []);

      return (
            <section className="bg-[#300b07]">
                  <ReactLenis root />
                  <RouterHandler />
            </section>
      );
};

export default App;
