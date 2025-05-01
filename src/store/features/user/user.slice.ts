import { IUser } from "@/interfaces/user.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UsersFilterState {
  search: string;
  role: "user" | "realtor" | "all";
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface UserState {
  loading: boolean;
  users: IUser[];
  filter: UsersFilterState;
  selectedUser: IUser | null;
  error: string | null;
  totalCount: number;
}

export const SLICE_NAME = "user";

const initialFilterState: UsersFilterState = {
  search: "",
  role: "all",
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const initialState: UserState = {
  loading: false,
  users: [],
  filter: initialFilterState,
  selectedUser: null,
  error: null,
  totalCount: 0,
};

const userSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setUsersLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setUsers(state, action: PayloadAction<{ data: IUser[]; total: number }>) {
      state.users = action.payload.data;
      state.totalCount = action.payload.total;
      state.loading = false;
      state.error = null;
    },
    setSelectedUser(state, action: PayloadAction<IUser | null>) {
      state.selectedUser = action.payload;
    },

    // Filter management
    setSearch: (state, action: PayloadAction<string>) => {
      state.filter.search = action.payload;
      state.filter.page = 1; // Reset to first page on new search
    },

    setRole: (state, action: PayloadAction<"user" | "realtor" | "all">) => {
      state.filter.role = action.payload;
      state.filter.page = 1; // Reset to first page on role change
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.filter.page = action.payload;
    },

    setLimit: (state, action: PayloadAction<number>) => {
      state.filter.limit = action.payload;
      state.filter.page = 1; // Reset to first page on limit change
    },

    setSort: (
      state,
      action: PayloadAction<{ field: string; direction: "asc" | "desc" }>
    ) => {
      state.filter.sortBy = action.payload.field;
      state.filter.sortOrder = action.payload.direction;
    },

    resetFilters: (state) => {
      state.filter = initialFilterState;
    },

    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Reset state
    resetUserState: () => initialState,
  },
});

export const {
  setUsersLoading,
  setUsers,
  setSearch,
  setRole,
  setPage,
  setLimit,
  setSort,
  resetFilters,
  setError,
  resetUserState,
  setSelectedUser,
} = userSlice.actions;

export default userSlice.reducer;
