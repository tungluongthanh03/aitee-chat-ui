import { createSlice } from "@reduxjs/toolkit";

export const isMemberSlice = createSlice({
  name: "isMember",
  initialState: {
    isMember: true,
    isGroup: true,
  },
  reducers: {
    updateStatus: (state) => {
      state.isMember = false;
    },
    resetStatus: (state) => {
        state.isMember = true;
    },
    updateStatusGroup: (state) => {
      state.isGroup = false;
    },
    resetStatusGroup: (state) => {
        state.isGroup = true;
    },
  },

});

export const { updateStatus, resetStatus, updateStatusGroup, resetStatusGroup } = isMemberSlice.actions;
export default isMemberSlice.reducer;
