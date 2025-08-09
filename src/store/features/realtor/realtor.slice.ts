import { IRealtor } from "@/interfaces/realtor.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RealtorsFilterState {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

interface Realtorstate {
  loading: boolean;
  realtors: IRealtor[];
  filter: RealtorsFilterState;
  selectedRealtor: IRealtor | null;
  error: string | null;
}

export const SLICE_NAME = "realtor";

export const initialFilterState: RealtorsFilterState = {
  page: 1,
  limit: 10,
};

const initialState: Realtorstate = {
  loading: false,
  realtors: [],
  filter: initialFilterState,
  selectedRealtor: null,
  error: null,
};

const realtorslice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setRealtorsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setRealtors(state, action: PayloadAction<IRealtor[]>) {
      state.realtors = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedRealtor(state, action: PayloadAction<IRealtor | null>) {
      state.selectedRealtor = action.payload;
    },
    setFilter(state, action: PayloadAction<Partial<RealtorsFilterState>>) {
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
  setRealtorsLoading,
  setRealtors,
  setSelectedRealtor,
  setFilter,
  resetFilter,
} = realtorslice.actions;

export default realtorslice.reducer;
