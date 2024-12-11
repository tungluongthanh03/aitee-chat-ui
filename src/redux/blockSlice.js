import { createSlice } from "@reduxjs/toolkit";

export const blockSlice = createSlice({
  name: "block",
  initialState: {
    blockerId: null,
    blockedId: null,
  },
  reducers: {
    updateBlock: (state, action) => {
      if (action.payload?.blockerId) {
        state.blockerId = action.payload.blockerId;
        state.blockedId = action.payload.blockedId;
      }
    },
    resetBlock: (state) => {
      state.blockerId = null;
      state.blockedId = null;
    },
  },
});

export const { updateBlock, resetBlock } = blockSlice.actions;
export default blockSlice.reducer;
