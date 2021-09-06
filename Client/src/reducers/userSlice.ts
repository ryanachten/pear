import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  username: string;
}

const initialState: UserState = {
  username: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
  },
});

export const { updateUsername } = userSlice.actions;

export default userSlice.reducer;
