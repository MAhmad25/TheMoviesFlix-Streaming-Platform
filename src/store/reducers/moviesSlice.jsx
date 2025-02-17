import { createSlice } from "@reduxjs/toolkit";

const initialState = {
      info: null,
};
export const movieSlicer = createSlice({
      name: "movie",
      initialState,
      reducers: {
            getMovie: (state, action) => {
                  state.info = action.payload;
            },
            removeMovie: (state) => {
                  state.info = null;
            },
      },
});
export const { getMovie, removeMovie } = movieSlicer.actions;
export default movieSlicer.reducer;
