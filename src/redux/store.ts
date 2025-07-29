// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import kycReducer from './slices/kycSlice';

export const store = configureStore({
    reducer: {
        kyc: kycReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
