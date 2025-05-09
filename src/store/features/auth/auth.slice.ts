import { IUser } from "@/interfaces/user.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  error: string | null;
  loading: boolean;
  accountType: "user" | "realtor" | null;
}

export const SLICE_NAME = "auth";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
  loading: false,
  accountType: null,
};

const authSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    loginSuccess(state, action: PayloadAction<{ user: IUser }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      state.loading = false;
    },

    loginFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
      state.loading = false;
      state.accountType = null;
    },

    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.loading = false;
      state.accountType = null;
    },

    clearError(state) {
      state.error = null;
    },

    updateUser(state, action: PayloadAction<Partial<IUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setAccountType: (
      state,
      action: PayloadAction<"user" | "realtor" | null>
    ) => {
      state.accountType = action.payload;
    },
  },
});

// Export actions
export const {
  setLoading,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
  setAccountType
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
