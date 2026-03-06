import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "../Components/pages/index";
import { Nav, NonExistingRoute } from "../Components/ui/index";
const MoviePage = lazy(() => import("../Components/pages/Movie/MoviePage"));
const TVPage = lazy(() => import("../Components/pages/TV/TVPage"));
const PeoplePage = lazy(() => import("../Components/pages/People/PeoplePage"));
const MovieDetails = lazy(() => import("../Components/pages/Movie/MovieDetails"));
const Trailer = lazy(() => import("../Components/pages/Trailer"));
const TvDetails = lazy(() => import("../Components/pages/TV/TvDetails"));
const Stream = lazy(() => import("../Components/pages/Stream"));
const PeopleDetails = lazy(() => import("../Components/pages/People/PeopleDetails"));
const Search = lazy(() => import("../Components/pages/Search"));

const Router = () => {
      return (
            <>
                  <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/trending" element={<MoviePage />} />
                              <Route path="/tv" element={<TVPage />} />
                              <Route path="/search" element={<Search />} />
                              <Route path="/people" element={<PeoplePage />} />
                              <Route path="/movie/details/:id" element={<MovieDetails />}>
                                    <Route path="trailer" element={<Trailer />} />
                                    <Route path="watch" element={<Stream category={"movie"} />} />
                              </Route>
                              <Route path="/tv/details/:id" element={<TvDetails />}>
                                    <Route path="trailer" element={<Trailer />} />
                                    <Route path="watch/:season/:seasonID" element={<Stream category={"tv"} />} />
                              </Route>
                              <Route path="/person/details/:id" element={<PeopleDetails />} />
                              <Route path="*" element={<NonExistingRoute />} />
                        </Routes>
                  </Suspense>
                  <Nav />
            </>
      );
};

export default Router;
