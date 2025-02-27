import RouterHandler from "../src/routes/RouterHandler";
import LocomotiveScroll from "locomotive-scroll";
const App = () => {
      new LocomotiveScroll();
      return <RouterHandler />;
};

export default App;
