import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/user.slice";
import authReducer from "./features/auth/auth.slice";
import propertyReducer from "./features/property/property.slice";
import adminReducer from "./features/admin/admin.slice";
import realtorReducer from "./features/realtor/realtor.slice";
import blogReducer from "./features/blog/blog.slice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PERSIST_STORE_NAME } from "@/constants/app.constant";

// Configuration for persisting state
const persistConfig = {
  key: PERSIST_STORE_NAME,
  storage,
  whitelist: ["auth"], // Only persist these slices
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  property: propertyReducer,
  user: userReducer,
  admin: adminReducer,
  realtor: realtorReducer,
  blog: blogReducer,
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
