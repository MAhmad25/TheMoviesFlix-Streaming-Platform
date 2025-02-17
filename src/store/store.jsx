import { configureStore } from "@reduxjs/toolkit";
import trendingSlicer from "./reducers/trendingSlice";
import movieSlicer from "./reducers/moviesSlice";
import tvSlicer from "./reducers/tvSlice";
import peopleSlicer from "./reducers/peopleSlicer";

export const store = configureStore({
      reducer: {
            trending: trendingSlicer,
            movie: movieSlicer,
            tv: tvSlicer,
            people: peopleSlicer,
      },
});
