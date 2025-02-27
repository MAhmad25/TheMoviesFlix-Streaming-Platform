import { configureStore } from "@reduxjs/toolkit";
import movieSlicer from "./reducers/moviesSlice";
import tvSlicer from "./reducers/tvSlice";
import peopleSlicer from "./reducers/peopleSlicer";

export const store = configureStore({
      reducer: {
            movie: movieSlicer,
            tv: tvSlicer,
            people: peopleSlicer,
      },
});
