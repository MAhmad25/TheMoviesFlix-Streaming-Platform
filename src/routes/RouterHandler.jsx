import { Route, Routes } from "react-router-dom";
import Home from "../Components/Home";
import Trending from "../Components/partials/Trending";
import Navbar from "../Components/partials/Navbar";
import Search from "../Components/partials/Search";
import TVShows from "../Components/TVShows";
import People from "../Components/People";
import MovieDetails from "../Components/Views/MovieDetails";
import TvDetails from "../Components/Views/TvDetails";
import PeopleDetails from "../Components/Views/PeopleDetails";
import Trailer from "../Components/Views/Trailer";
const Router = () => {
      return (
            <>
                  <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/trending" element={<Trending />} />
                        <Route path="/tv" element={<TVShows />} />
                        <Route path="/people" element={<People />} />
                        <Route path="/movie/details/:id" element={<MovieDetails />}>
                              <Route path="trailer" element={<Trailer />} />
                        </Route>
                        <Route path="/tv/details/:id" element={<TvDetails />}>
                              <Route path="trailer" element={<Trailer />} />
                        </Route>
                        <Route path="/person/details/:id" element={<PeopleDetails />} />
                  </Routes>
                  <Navbar />
            </>
      );
};

export default Router;
