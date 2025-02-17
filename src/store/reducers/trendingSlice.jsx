import { createSlice } from "@reduxjs/toolkit";

const initialState = {
      info: null,
};
export const trendingSlicer = createSlice({
      name: "trending",
      initialState,
      reducers: {
            getTrending: (state, action) => {
                  state.info = action.payload;
            },
            removeTrending: (state, action) => {
                  state.info = null;
            },
      },
});
export const { getTrending, removeTrending } = trendingSlicer.actions;
export default trendingSlicer.reducer;
