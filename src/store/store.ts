import { combineReducers, configureStore } from "@reduxjs/toolkit";
import propertyReducer from "./features/property/propertySlice";
import userReducer from "./features/user/user.slice";
import authReducer from "./features/auth/auth.slice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PERSIST_STORE_NAME } from "@/constants/app.constant";

// Configuration for persisting state
const persistConfig = {
  key: PERSIST_STORE_NAME,
  storage,
  whitelist: ["property", "auth"], // Only persist these slices
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  property: propertyReducer,
  user: userReducer,
});

// Wrap reducers with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export store
export default store;

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
