import { Route, Routes } from "react-router-dom";
import Home from "../Components/Home";
import Trending from "../Components/partials/Trending";
import Navbar from "../Components/partials/Navbar";
import { useContext } from "react";
import Search from "../Components/partials/Search";
import { SearchState } from "../contexts/Search";
import TVShows from "../Components/TVShows";
import People from "../Components/People";
import MovieDetails from "../Components/Views/MovieDetails";
import TvDetails from "../Components/Views/tvDetails";
import PeopleDetails from "../Components/Views/peopleDetails";
import Trailer from "../Components/Views/Trailer";
const Router = () => {
      // const { isSearchEnable } = useContext(SearchState);
      return (
            <>
                  <Routes>
                        <Route path="/search" element={<Search />} />
                        <Route path="/" element={<Home />} />
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
