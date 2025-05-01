import { IProperty } from "@/interfaces/property.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PropertyState {
  loading: boolean;
  properties: IProperty[];
  selectedProperty: IProperty | null;
  error: string | null;
}

export const SLICE_NAME = "property";

const initialState: PropertyState = {
  loading: false,
  properties: [],
  selectedProperty: null,
  error: null,
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
    },
    setSelectedProperty(state, action: PayloadAction<IProperty | null>) {
      state.selectedProperty = action.payload;
    },
  },
});

export const { setLoading, setProperties, setSelectedProperty } =
  propertySlice.actions;

export default propertySlice.reducer;
