import { createSlice } from "@reduxjs/toolkit";

const initialState = {
      info: null,
};
export const peopleSlicer = createSlice({
      name: "people",
      initialState,
      reducers: {
            getPeople: (state, action) => {
                  state.info = action.payload;
            },
            removePeople: (state) => {
                  state.info = null;
            },
      },
});
export const { getPeople, removePeople } = peopleSlicer.actions;
export default peopleSlicer.reducer;
