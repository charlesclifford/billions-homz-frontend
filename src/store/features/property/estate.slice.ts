import { IEstate } from "@/interfaces/estate.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EstateFilterState {
  page: number;
  limit: number;
  location?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface EstateState {
  loading: boolean;
  estates: IEstate[];
  selectedEstate: IEstate | null;
  error: string | null;
  filter: EstateFilterState;
}

export const SLICE_NAME = "estate";

export const initialFilterState: EstateFilterState = {
  page: 1,
  limit: 15,
};

const initialState: EstateState = {
  loading: false,
  estates: [],
  selectedEstate: null,
  error: null,
  filter: initialFilterState,
};

const estateSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setEstates(state, action: PayloadAction<IEstate[]>) {
      state.estates = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedEstate(state, action: PayloadAction<IEstate | null>) {
      state.selectedEstate = action.payload;
    },
    setFilter(state, action: PayloadAction<Partial<EstateFilterState>>) {
      state.filter = { ...state.filter, ...action.payload };
      // Reset to first page when filters change (except page/limit)
      if (
        action.payload.location !== undefined ||
        action.payload.search !== undefined
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
  setLoading,
  setEstates,
  setSelectedEstate,
  setFilter,
  resetFilter,
} = estateSlice.actions;

export default estateSlice.reducer;
