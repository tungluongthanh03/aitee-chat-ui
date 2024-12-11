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

    moreMessage: (state, action) => {
      state.list = [...action.payload, ...state.list];
    },

    handledMediaMessage: (state, action) => {
      if (state.list[state.list.length - 1].media.length > 0) {
        state.list[state.list.length - 1].images = action.payload.images;
        state.list[state.list.length - 1].videos = action.payload.videos;
        state.list[state.list.length - 1].media = [];
      }
    },
  },
});

export const { updateMessages, newMessage, handledMediaMessage, moreMessage } =
  messagesSlice.actions;
export default messagesSlice.reducer;
