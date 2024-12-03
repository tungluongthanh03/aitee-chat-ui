import { createSlice } from "@reduxjs/toolkit";

export const groupChatSlice = createSlice({
  name: "groupChat",
  initialState: {
    id: null,
    name: null,
    avatar:
      null,
    list: null,
  },
  reducers: {
    updateGroupChat: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.avatar = action.payload.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1gV7Edmn4Kmaz5tlr5d3K0Cyn17qa1Z-MCQ&s";
      state.list = action.payload.list;
    },
    resetGroupChat: (state) => {
      state.id = null;
      state.name = null;
      state.avatar = null;
      state.list = null;

    }
  },
});

export const { updateGroupChat, resetGroupChat } =
  groupChatSlice.actions;
export default groupChatSlice.reducer;
