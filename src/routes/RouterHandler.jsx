import { Route, Routes } from "react-router-dom";
import { Home, TVPage, PeoplePage, MovieDetails, Trailer, TvDetails, Stream, PeopleDetails, Search, MoviePage } from "../Components/pages/index";
import { Navbar, NonExistingRoute } from "../Components/ui/index";

const Router = () => {
      return (
            <>
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
                  <Navbar />
                  {/* Will change the Nav Bar */}
            </>
      );
};

export default Router;
