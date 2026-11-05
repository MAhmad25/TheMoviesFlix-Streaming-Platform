import { Suspense, lazy, useEffect, useRef } from "react";
import { Header, CastLoader } from "../ui/index";
import { expectHomeLoads } from "../../utils/initialLoad";
const TrendingContainer = lazy(() => import("../ui/TrendingContainer"));
const HomeSections = lazy(() => import("../ui/HomeSections"));
const Home = () => {
      document.title = "MoviesFlix | Movie & TV Streaming ";

      useEffect(() => {
            expectHomeLoads(["header", "trending", "upcoming", "now-playing-tv", "top-rated", "animated"]);
      }, []);

      // URLS
      const UpcomingMoviesUrl = useRef("movie/upcoming?page=1");
      const TopRatedMovies = useRef("movie/top_rated");
      const Animated = useRef("/search/multi?query=animated");
      const NowPlayingTVSeries = useRef("discover/tv?include_adult=true&include_video=true&language=en-US&page=1&sort_by=popularity.desc");
      return (
            <div className="w-full [background-image:var(--bg-gradient)] relative space-y-5 overflow-hidden font-primary min-h-dvh pb-28">
                  <Header />
                  <div className="min-h-40">
                        <Suspense fallback={<CastLoader />}>
                              <TrendingContainer />
                        </Suspense>
                  </div>
                  <div className="min-h-40">
                        <Suspense fallback={<CastLoader />}>
                              <HomeSections url={UpcomingMoviesUrl.current} sectionName={"Upcoming Movies"} loadKey="upcoming" />
                        </Suspense>
                  </div>
                  <div className="min-h-40">
                        <Suspense fallback={<CastLoader />}>
                              <HomeSections url={NowPlayingTVSeries.current} sectionName={"Now Playing TV Series"} loadKey="now-playing-tv" />
                        </Suspense>
                  </div>
                  <div className="min-h-40">
                        <Suspense fallback={<CastLoader />}>
                              <HomeSections url={TopRatedMovies.current} sectionName={"Top Rated Movies"} loadKey="top-rated" />
                        </Suspense>
                  </div>
                  <div className="min-h-40 pb-20 sm:pb-0">
                        <Suspense fallback={<CastLoader />}>
                              <HomeSections url={Animated.current} sectionName={"Animated"} loadKey="animated" />
                        </Suspense>
                  </div>
            </div>
      );
};

export default Home;
