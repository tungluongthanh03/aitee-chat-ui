import { createSlice } from "@reduxjs/toolkit";

export const chatUserSlice = createSlice({
  name: "chatUser",
  initialState: {
    username: null,
    avatar:
      null,
  },
  reducers: {
    update: (state) => {
      state.username = "Dogg_007";
      state.avatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB";
    },
  },
});

export const { update } =
  chatUserSlice.actions;
export default chatUserSlice.reducer;
