import { Suspense } from "react";
import { TrendingContainer, Header, ComingSoonContainer, CastLoader } from "../ui/index";
const Home = () => {
      document.title = "MoviesFlix | Movie & TV Streaming ";
      return (
            <div className="w-full [background-image:var(--bg-gradient)] relative overflow-hidden font-Stoshi min-h-full sm:pb-10 md:pb-0 sm:mb-0">
                  <Header />
                  <Suspense fallback={<CastLoader />}>
                        <TrendingContainer />
                  </Suspense>
                  <Suspense fallback={<CastLoader />}>
                        <ComingSoonContainer />
                  </Suspense>
            </div>
      );
};

export default Home;
