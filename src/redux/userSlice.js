import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    id: null,
    username: null,
    avatar:
      null,
    accessToken: null,
  },
  reducers: {
    updateUser: (state, action) => {
      state.username = action.payload.username;
      state.avatar = action.payload.avatar;
      state.id = action.payload.id;
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const { updateUser } =
  userSlice.actions;
export default userSlice.reducer;
