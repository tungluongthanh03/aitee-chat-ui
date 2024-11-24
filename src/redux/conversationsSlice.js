import { createSlice } from "@reduxjs/toolkit";

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState: {
    list: [],
  },
  reducers: {
    updateConversations: (state, action) => {
      state.list = action.payload;
    },

    newConversation: (state, action) => {
      state.list.forEach((conversation, id) => {
        if (conversation.id === action.payload.id) {
          state.list.slice(id, 1);
        }
      });
      state.list.unshift(action.payload);
    },
  },
});

export const { updateConversations, newConversation } =
  conversationsSlice.actions;
export default conversationsSlice.reducer;
