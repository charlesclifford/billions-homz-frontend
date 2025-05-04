import { IUser } from "@/interfaces/user.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UsersFilterState {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface UserState {
  loading: boolean;
  users: IUser[];
  filter: UsersFilterState;
  selectedUser: IUser | null;
  error: string | null;
}

export const SLICE_NAME = "user";

const initialFilterState: UsersFilterState = {
  page: 1,
  limit: 10,
};

const initialState: UserState = {
  loading: false,
  users: [],
  filter: initialFilterState,
  selectedUser: null,
  error: null,
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
      state.error = null;
    },
    setSelectedUser(state, action: PayloadAction<IUser | null>) {
      state.selectedUser = action.payload;
    },
    setFilter(state, action: PayloadAction<Partial<UsersFilterState>>) {
      state.filter = { ...state.filter, ...action.payload };
      // Reset to first page when filters change (except page/limit)
      if (
        action.payload.search !== undefined ||
        action.payload.status !== undefined
      ) {
        state.filter.page = 1;
      }
    },
    resetFilter(state) {
      state.filter = initialFilterState;
    },
  },
});

export const {
  setUsersLoading,
  setUsers,
  setSelectedUser,
  setFilter,
  resetFilter,
} = userSlice.actions;

export default userSlice.reducer;
