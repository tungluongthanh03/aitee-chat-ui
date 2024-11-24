import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    list: [],
  },
  reducers: {
    updateMessages: (state, action) => {
      state.list = action.payload;
    },

    newMessage: (state, action) => {
      state.list.push(action.payload);
    },
  },
});

export const { updateMessages, newMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
