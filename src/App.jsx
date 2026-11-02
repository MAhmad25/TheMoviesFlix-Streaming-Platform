import RouterHandler from "../src/routes/RouterHandler";
import { ReactLenis } from "lenis/react";
const App = () => {
      return (
            <section className="bg-[#300b07]">
                  <ReactLenis root />
                  <RouterHandler />
            </section>
      );
};

export default App;
