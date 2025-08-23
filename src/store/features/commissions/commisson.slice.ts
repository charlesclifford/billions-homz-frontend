import { ICommission, StatusType } from "@/interfaces/commission.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommissionFilterState {
  page: number;
  limit: number;
  status?: StatusType;
  startDate?: string;
  endDate?: string;
  search?: string;
}

interface TabPagination {
  [status: string]: {
    page: number;
    limit: number;
  };
}

interface CommissionState {
  loading: boolean;
  commissions: ICommission[];
  filter: CommissionFilterState;
  tabPagination: TabPagination;
}

export const SLICE_NAME = "commissions";

export const initialFilterState: CommissionFilterState = {
  page: 1,
  limit: 10,
  status: "pending",
};

const initialState: CommissionState = {
  loading: false,
  commissions: [],
  filter: initialFilterState,
  tabPagination: {
    pending: { page: 1, limit: 10 },
    requested: { page: 1, limit: 10 },
    paid: { page: 1, limit: 10 },
  },
};

const commissionSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setCommissionLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCommissions(state, action: PayloadAction<ICommission[]>) {
      state.commissions = action.payload;
      state.loading = false;
    },
    setFilter(state, action: PayloadAction<Partial<CommissionFilterState>>) {
      state.filter = {
        ...state.filter,
        ...action.payload,
      };
    },
    setTabPage(state, action: PayloadAction<{ status: string; page: number }>) {
      const { status, page } = action.payload;
      if (state.tabPagination[status]) {
        state.tabPagination[status].page = page;
      }
    },
    resetFilter(state) {
      state.loading = false;
      state.commissions = [];
      state.filter = initialFilterState;
      state.tabPagination = {
        pending: { page: 1, limit: 10 },
        requested: { page: 1, limit: 10 },
        paid: { page: 1, limit: 10 },
      };
    },
  },
});

export const {
  setCommissionLoading,
  setCommissions,
  setFilter,
  resetFilter,
  setTabPage,
} = commissionSlice.actions;

export default commissionSlice.reducer;
