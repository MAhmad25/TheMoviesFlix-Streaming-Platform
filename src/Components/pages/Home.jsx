import { Suspense } from "react";
import { TrendingContainer, Header, ComingSoonContainer, CastLoader } from "../ui/index";
const Home = () => {
      document.title = "MoviesFlix | Movie & TV Streaming ";
      return (
            <div className="w-full [background-image:var(--bg-gradient)] relative space-y-5 overflow-hidden font-primary min-h-full sm:pb-10 md:pb-0 sm:mb-0">
                  <Header />
                  <div className="min-h-40">
                        <Suspense fallback={<CastLoader />}>
                              <TrendingContainer />
                        </Suspense>
                  </div>
                  <div className="min-h-40">
                        <Suspense fallback={<CastLoader />}>
                              <ComingSoonContainer />
                        </Suspense>
                  </div>
            </div>
      );
};

export default Home;
