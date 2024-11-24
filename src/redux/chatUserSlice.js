import { createSlice } from "@reduxjs/toolkit";

export const chatUserSlice = createSlice({
  name: "chatUser",
  initialState: {
    id: null,
    username: null,
    avatar:
      null,
  },
  reducers: {
    updateChatUser: (state, action) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.avatar = action.payload.avatar;
    },
  },
});

export const { updateChatUser } =
  chatUserSlice.actions;
export default chatUserSlice.reducer;
