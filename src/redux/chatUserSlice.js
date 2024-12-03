import { createSlice } from "@reduxjs/toolkit";

export const chatUserSlice = createSlice({
  name: "chatUser",
  initialState: {
    id: null,
    username: null,
    avatar: null,
  },
  reducers: {
    updateChatUser: (state, action) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.avatar = action.payload.avatar || "https://cdn-icons-png.flaticon.com/512/9187/9187604.png";
    },
    resetChatUser: (state) => {
      state.id = null;
      state.username = null;
      state.avatar = null;
    },
  },
});

export const { updateChatUser, resetChatUser } = chatUserSlice.actions;
export default chatUserSlice.reducer;
