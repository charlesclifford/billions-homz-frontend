import {
  IInspection
} from "@/interfaces/inspection.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InspectionFilterState {
  page: number;
  limit: number;
  status?: string;
  day?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface InspectionState {
  loading: boolean;
  inspections: IInspection[];
  filter: InspectionFilterState;
}

export const SLICE_NAME = "inspections";

export const initialFilterState: InspectionFilterState = {
  page: 1,
  limit: 10,
};

const initialState: InspectionState = {
  loading: false,
  inspections: [],
  filter: initialFilterState,
};

const inspectionSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setInspectionLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setInspections(state, action: PayloadAction<IInspection[]>) {
      state.inspections = action.payload;
      state.loading = false;
    },
    setFilter(state, action: PayloadAction<Partial<InspectionFilterState>>) {
      state.filter = {
        ...state.filter,
        ...action.payload,
      };
    },
    resetFilter(state) {
      state.loading = false;
      state.inspections = [];
      state.filter = initialFilterState;
    },
  },
});

export const { setInspectionLoading, setInspections, setFilter, resetFilter } =
  inspectionSlice.actions;

export default inspectionSlice.reducer;
