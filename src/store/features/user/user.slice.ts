import { IUser } from "@/interfaces/user.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  loading: boolean;
  users: IUser[];
}

export const SLICE_NAME = "user";

const initialState: UserState = {
  loading: false,
  users: [],
};

const userSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setUsersLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setUsers(state, action: PayloadAction<IUser[]>) {
      state.users = action.payload;
      state.loading = false;
    },
  },
});

export const { setUsersLoading, setUsers } = userSlice.actions;

export default userSlice.reducer;
