import { ITestimonial } from "@/interfaces/testimonial.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TestimonialFilterState {
  page: number;
  limit: number;
  active?: boolean;
  featured?: boolean;
}

interface TestimonialState {
  loading: boolean;
  testimonials: ITestimonial[];
  error: string | null;
  filter: TestimonialFilterState;
}

export const SLICE_NAME = "testimonial";

export const initialFilterState: TestimonialFilterState = {
  page: 1,
  limit: 10,
};

const initialState: TestimonialState = {
  loading: false,
  testimonials: [],
  error: null,
  filter: initialFilterState,
};

const testimonialSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setTestimonials(state, action: PayloadAction<ITestimonial[]>) {
      state.testimonials = action.payload;
      state.loading = false;
      state.error = null;
    },
    setFilter(state, action: PayloadAction<Partial<TestimonialFilterState>>) {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetFilter(state) {
      state.filter = initialFilterState;
    },
  },
});

export const { setLoading, setTestimonials, setFilter, resetFilter } =
  testimonialSlice.actions;

export default testimonialSlice.reducer;
