import { ICommission } from "@/interfaces/commission.interface";
import { createSlice } from "@reduxjs/toolkit";

interface CommissionFilterState {
  page: number;
  limit: number;
  status?: string | null;
  startDate?: string;
  endDate?: string;
}

interface CommissionState {
  loading: boolean;
  commissions: ICommission[];
  filter: CommissionFilterState;
}

export const SLICE_NAME = "commissions";

export const initialFilterState: CommissionFilterState = {
  page: 1,
  limit: 10,
};

const initialState: CommissionState = {
  loading: false,
  commissions: [],
  filter: initialFilterState,
};

const commissionSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
});

export const {} = commissionSlice.actions;

export default commissionSlice.reducer;
