import { ISale } from "@/interfaces/sales.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SaleFilterState {
  page: number;
  limit: number;
  // status?: StatusType;
  startDate?: string;
  endDate?: string;
}

interface SalesSate {
  loading: boolean;
  sales: ISale[];
  filter: SaleFilterState;
}

export const SLICE_NAME = "sales";

export const initialFilterState: SaleFilterState = {
  page: 1,
  limit: 10,
};

const initialState: SalesSate = {
  loading: false,
  sales: [],
  filter: initialFilterState,
};

const salesSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setSaleLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSales(state, action: PayloadAction<ISale[]>) {
      state.sales = action.payload;
      state.loading = false;
    },
    setFilter(state, action: PayloadAction<Partial<SaleFilterState>>) {
      state.filter = {
        ...state.filter,
        ...action.payload,
      };
    },
    resetFilter(state) {
      state.loading = false;
      state.sales = [];
      state.filter = initialFilterState;
    },
  },
});

export const { setSaleLoading, setSales, setFilter } = salesSlice.actions;

export default salesSlice.reducer;
