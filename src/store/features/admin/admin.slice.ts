import { IAdmin } from "@/interfaces/admin.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminFilterState {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

interface AdminState {
  loading: boolean;
  admins: IAdmin[];
  filter: AdminFilterState;
  selectedAdmin: IAdmin | null;
  error: string | null;
}

export const SLICE_NAME = "admin";

export const initialFilterState: AdminFilterState = {
  page: 1,
  limit: 10,
};

const initialState: AdminState = {
  loading: false,
  admins: [],
  filter: initialFilterState,
  selectedAdmin: null,
  error: null,
};

const adminSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setAdminsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setUsers(state, action: PayloadAction<IAdmin[]>) {
      state.admins = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedAdmin(state, action: PayloadAction<IAdmin | null>) {
      state.selectedAdmin = action.payload;
    },
    setFilter(state, action: PayloadAction<Partial<AdminFilterState>>) {
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
  setAdminsLoading,
  setUsers,
  setSelectedAdmin,
  setFilter,
  resetFilter,
} = adminSlice.actions;

export default adminSlice.reducer;
