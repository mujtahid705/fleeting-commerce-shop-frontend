import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/slice";
import userReducer from "./slices/userSlice";
import productsReducer from "./slices/productsSlice";
import ordersReducer from "./slices/ordersSlice";
import cartReducer from "./slices/cartSlice";
import favoritesReducer from "./slices/favoritesSlice";
import tenantReducer from "./slices/tenantSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    products: productsReducer,
    orders: ordersReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    tenant: tenantReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
