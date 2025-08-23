import { IProperty } from "@/interfaces/property.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PropertyFilterState {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  status?: string;
  listingType?: string;
  location?: string;
}

interface PropertyState {
  loading: boolean;
  properties: IProperty[];
  selectedProperty: IProperty | null;
  error: string | null;
  filter: PropertyFilterState;
}

export const SLICE_NAME = "property";

export const initialFilterState: PropertyFilterState = {
  page: 1,
  limit: 10,
};

const initialState: PropertyState = {
  loading: false,
  properties: [],
  selectedProperty: null,
  error: null,
  filter: initialFilterState,
};

const propertySlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setProperties(state, action: PayloadAction<IProperty[]>) {
      state.properties = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedProperty(state, action: PayloadAction<IProperty | null>) {
      state.selectedProperty = action.payload;
    },
    setFilter(state, action: PayloadAction<Partial<PropertyFilterState>>) {
      state.filter = { ...state.filter, ...action.payload };
      // Reset to first page when filters change (except page/limit)
      if (action.payload.search !== undefined) {
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
  setProperties,
  setSelectedProperty,
  setFilter,
  resetFilter,
} = propertySlice.actions;

export default propertySlice.reducer;
