import { createSlice } from "@reduxjs/toolkit";

const initialState = {
      info: null,
};
export const tvSlicer = createSlice({
      name: "tv",
      initialState,
      reducers: {
            getTv: (state, action) => {
                  state.info = action.payload;
            },
            removeTv: (state) => {
                  state.info = null;
            },
      },
});
export const { getTv, removeTv } = tvSlicer.actions;
export default tvSlicer.reducer;
