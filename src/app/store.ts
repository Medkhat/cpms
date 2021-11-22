import { configureStore } from "@reduxjs/toolkit";
import audit from "./reducers/audit";
import auth from "./reducers/auth";
import partners from "./reducers/partners";
import products from "./reducers/products";

export const store = configureStore({
  reducer: { auth, products, partners, audit },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
