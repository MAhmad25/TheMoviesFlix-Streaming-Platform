import { Suspense, lazy, useRef } from "react";
import { Header, CastLoader } from "../ui/index";
const TrendingContainer = lazy(() => import("../ui/TrendingContainer"));
const HomeSections = lazy(() => import("../ui/HomeSections"));
const Home = () => {
      document.title = "MoviesFlix | Movie & TV Streaming ";
      // URLS
      const UpcomingMoviesUrl = useRef("movie/upcoming?page=1");
      const TopRatedMovies = useRef("movie/top_rated");
      const Animated = useRef("/search/multi?query=animated");
      const NowPlayingTVSeries = useRef("discover/tv?include_adult=true&include_video=true&language=en-US&page=1&sort_by=popularity.desc");
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
                              <HomeSections url={UpcomingMoviesUrl.current} sectionName={"Upcoming Movies"} />
                        </Suspense>
                  </div>
                  <div className="min-h-40">
                        <Suspense fallback={<CastLoader />}>
                              <HomeSections url={NowPlayingTVSeries.current} sectionName={"Now Playing TV Series"} />
                        </Suspense>
                  </div>
                  <div className="min-h-40">
                        <Suspense fallback={<CastLoader />}>
                              <HomeSections url={TopRatedMovies.current} sectionName={"Top Rated Movies"} />
                        </Suspense>
                  </div>
                  <div className="min-h-40 pb-20 sm:pb-0">
                        <Suspense fallback={<CastLoader />}>
                              <HomeSections url={Animated.current} sectionName={"Animated"} />
                        </Suspense>
                  </div>
            </div>
      );
};

export default Home;
