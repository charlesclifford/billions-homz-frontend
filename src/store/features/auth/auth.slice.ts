import { IUser } from "@/interfaces/user.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null;
  error: string | null;
  loading: boolean;
}

export const SLICE_NAME = "auth";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    // Action to set loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    // Action to handle login success
    loginSuccess(state, action: PayloadAction<{ user: IUser; token: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },

    // Action to handle login failure
    loginFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
    },

    // Action to handle logout
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },

    // Action to clear errors
    clearError(state) {
      state.error = null;
    },
  },
});

// Export the actions
export const { setLoading, loginSuccess, loginFailure, logout, clearError } =
  authSlice.actions;

// Export the reducer
export default authSlice.reducer;
